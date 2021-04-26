<template>
    <app-layout>
        <view class="group main-center cross-center">
            <view @click="choose(item,index)" v-for="(item,index) in attr_groups" :key="index" class="box-grow-1 group-item main-center cross-center">
                <view :class="['group-name', 't-omit', `${item.choose? 'active':''}`]">{{item.choose ? item.choose_attr : item.attr_group_name}}</view>
                <image v-if="showGroup && groupIndex == index" class="more" :src="item.choose ? './../image/close.png' :'/static/image/icon/icon-up.png'"></image>
                <image class="more" v-else :src="item.choose ? './../image/open.png' :'/static/image/icon/icon-down.png'"></image>
            </view>
        </view>
        <view class="attr-group-holder"></view>
        <view>
            <view class="attr-item" v-if="item.show == listLength" v-for="(item,index) in attr" :key="item.id">
               <template v-if="startIndex < item.showIndex && item.showIndex < endIndex">
                   <view class="attr-name">
                       <view class="check" @click="unSelect(item,index)">
                           <image src="/static/image/icon/icon-uncheck.png" v-if="!item.select"></image>
                           <image src="/static/image/icon/icon-checkbox-checked-a.png" v-else></image>
                       </view>
                       <view class="dir-left-wrap cross-center">
                           <view class="attr-group" v-for="(attr,idx) in item.attr_list" :key="idx">
                               <text class="attr-group-name">{{attr.attr_group_name}}：</text>
                               <text>{{attr.attr_name}}</text>
                           </view>
                       </view>
                   </view>
                   <view style="background-color: #fff">
                       <view class='info-item cross-center dir-left-nowrap'>
                           <view class="form-label">售价</view>
                           <view class='dir-left-nowrap price-input cross-center main-between'>
                               <input
                                   :value="item.price"
                                   :focus="inputName && chooseIndex == item.id"
                                   @blur="nameBlur(item.id,$event)"
                                   v-if="inputName && chooseIndex == item.id"
                                   placeholder-style="color: #cdcdcd"
                                   placeholder="请输入售价"
                                   type='digit'
                                   class='input'
                               />
                               <view v-else :class="item.price ? 'input input-item' : 'input input-item placeholder'" @click="nameBlur(item.id)">{{item.price ? item.price :'请输入售价'}}</view>
                               <view>元</view>
                           </view>
                       </view>
                       <view class='info-item cross-center dir-left-nowrap'>
                           <view class="form-label">库存</view>
                           <view class='dir-left-nowrap price-input cross-center main-between'>
                               <input
                                   :focus="inputStock && chooseIndex == item.id"
                                   @blur="stockBlur(item.id,$event)"
                                   v-if="inputStock && chooseIndex == item.id"
                                   placeholder-style="color: #cdcdcd"
                                   placeholder="请输入库存"
                                   type='number'
                                   class='input unit'
                                   :value="item.stock"
                               />
                               <view v-else :class="item.stock ? 'input unit input-item' : 'input unit input-item placeholder'" @click="stockBlur(item.id)">{{item.stock ? item.stock :'请输入库存'}}</view>
                               <view class="unit-width">{{unit}}</view>
                           </view>
                       </view>
                       <view class='info-item cross-center dir-left-nowrap'>
                           <view class="form-label">货号</view>
                           <view class='dir-left-nowrap price-input cross-center'>
                               <input
                                   :focus="inputNo && chooseIndex == item.id"
                                   @blur="noBlur(item.id,$event)"
                                   v-if="inputNo && chooseIndex == item.id"
                                   placeholder-style="color: #cdcdcd"
                                   placeholder="请输入货号"
                                   class='input'
                                   :value="item.no"
                               />
                               <view v-else :class="item.no ? 'input input-item' : 'input input-item placeholder'" @click="noBlur(item.id)">{{item.no ? item.no :'请输入货号'}}</view>
                           </view>
                       </view>
                       <view class='info-item cross-center dir-left-nowrap'>
                           <view class="form-label">重量</view>
                           <view class='dir-left-nowrap cross-center price-input'>
                               <input
                                   :focus="inputWeight && chooseIndex == item.id"
                                   @blur="weightBlur(item.id,$event)"
                                   v-if="inputWeight && chooseIndex == item.id"
                                   placeholder-style="color: #cdcdcd"
                                   placeholder="请输入重量"
                                   type='digit'
                                   class='input'
                                   :value="item.weight"
                               />
                               <view v-else :class="item.weight ? 'input input-item' : 'input input-item placeholder'" @click="weightBlur(item.id)">{{item.weight ? item.weight :'请输入重量'}}</view>
                               <view>g</view>
                           </view>
                       </view>
                   </view>
               </template>
            </view>
        </view>
        <view :class="['placeholder', `${iphone_x? 'iphone_x':''}`]"></view>
        <view :class="['bottom', 'cross-center', 'dir-left-nowrap', `${iphone_x? 'iphone_x':''}`]">
            <view @click="allSelect" class="check">
                <image src="/static/image/icon/icon-uncheck.png" v-if="!selectStatus"></image>
                <image src="/static/image/icon/icon-checkbox-checked-a.png" v-else></image>
            </view>
            <view>全选</view>
            <view @click="allSetting" class="all-setting">批量设置</view>
            <view @click="save" :class="['save-btn', `${iphone_x? 'iphone_x':''}`]">保存</view>
        </view>
        <view @touchmove.stop.prevent="" :class="['bg', `${showSetting? 'again':''}`]" v-if="showGroup || showSetting">
            <view class="dialog-group" v-if="showGroup">
                <view @click="confirm(-1)" class="dialog-group-name t-omit">{{ '全部' + chooseGroup.attr_group_name}}</view>
                <view @click="confirm(index,item)" v-for="(item,index) in chooseGroup.attr_list" :key="item.attr_id" :class="['dialog-group-name', 't-omit', `${item.choose? 'active':''}`]">{{item.attr_name}}</view>
            </view>
            <view :class="['dialog-setting', `${iphone_x? 'iphone_x':''}`]" v-if="showSetting">
                <view class="dialog-setting-title main-between cross-center">
                    <view @click="close" class="dialog-setting-btn">取消</view>
                    <view>批量设置</view>
                    <view @click="settingSubmit" class="dialog-setting-btn">确定</view>
                </view>
                <view style="background-color: #fff">
                    <view class='info-item cross-center dir-left-nowrap'>
                        <view class="form-label">售价</view>
                        <view class='dir-left-nowrap price-input cross-center main-between'>
                            <input @input="settingValue($event,'price')" placeholder-style="color: #cdcdcd" placeholder="请输入售价" type='digit' class='input'/>
                            <view>元</view>
                        </view>
                    </view>
                    <view class='info-item cross-center dir-left-nowrap'>
                        <view class="form-label">库存</view>
                        <view class='dir-left-nowrap price-input cross-center main-between'>
                            <input @input="settingValue($event,'stock')" placeholder-style="color: #cdcdcd" placeholder="请输入库存" type='number' class='input unit'/>
                                <view class="unit-width">{{unit}}</view>
                        </view>
                    </view>
                    <view class='info-item cross-center dir-left-nowrap'>
                        <view class="form-label">货号</view>
                        <view class='dir-left-nowrap price-input cross-center'>
                            <input @input="settingValue($event,'no')" placeholder-style="color: #cdcdcd" placeholder="请输入货号" class='input'/>
                        </view>
                    </view>
                    <view class='info-item cross-center dir-left-nowrap'>
                        <view class="form-label">重量</view>
                        <view class='dir-left-nowrap cross-center price-input'>
                            <input @input="settingValue($event,'weight')" placeholder-style="color: #cdcdcd" placeholder="请输入重量" type='number' class='input'/>
                            <view>g</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>

    export default {
        data() {
            return {
                iphone_x: false,
                attr_groups: [],
                attr_list: [],
                unit: '件',
                attr: [],
                select: false,
                chooseAttr: {},
                chooseGroup: {},
                chooseList: [],
                selectList: [],
                selectStatus: false,
                chooseIndex: -1,
                listLength: 0,
                showGroup: false,
                showSetting: false,
                inputName: false,
                inputStock: false,
                inputNo: false,
                inputWeight: false,
                startIndex: -10,
                endIndex: 90,
                setting: {
                    price: '',
                    stock: '',
                    no: '',
                    weight: '',
                },
                groupIndex: -1
            }
        },
        methods: {
            settingValue(e, name) {
                let value = e.detail.value;
                switch (name) {
                    case 'price':
                        this.setting.price = value;
                        break;
                    case 'stock':
                        this.setting.stock = value;
                        break;
                    case 'no':
                        this.setting.no = value;
                        break;
                    case 'weight':
                        this.setting.weight = value;
                        break;
                }
            },
            nameBlur(id,e) {
                if(!e) {
                    this.inputName = true;
                    this.inputStock = false;
                    this.inputNo = false;
                    this.inputWeight = false;
                    this.chooseIndex = id;
                }else {
                    this.inputName = false;
                    this.attr[id].price = this.money(e.detail.value);
                }
            },
            stockBlur(id,e) {
                if(!e) {
                    this.inputStock = true;
                    this.inputName = false;
                    this.inputNo = false;
                    this.inputWeight = false;
                    this.chooseIndex = id;
                }else {
                    this.inputStock = false;
                    this.attr[id].stock = e.detail.value;
                }
            },
            noBlur(id,e) {
                if(!e) {
                    this.inputNo = true;
                    this.inputName = false;
                    this.inputStock = false;
                    this.inputWeight = false;
                    this.chooseIndex = id;
                }else {
                    this.inputNo = false;
                    this.attr[id].no = e.detail.value;
                }
            },
            weightBlur(id,e) {
                if(!e) {
                    this.inputWeight = true;
                    this.inputName = false;
                    this.inputStock = false;
                    this.inputNo = false;
                    this.chooseIndex = id;
                }else {
                    this.inputWeight = false;
                    this.attr[id].weight = e.detail.value;
                }
            },
            money(val) {
              let num = val.toString(); //先转换成字符串类型
              if (num.indexOf('.') === 0) { //第一位就是 .
                num = '0' + num
              }
              num = num.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
              num = num.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
              num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
              num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
              if (num.indexOf(".") < 0 && num != "") {
                num = parseFloat(num);
              }
              return num
            },
            allSetting() {
                let select = false;
                for(let i in this.attr) {
                    if(this.attr[i].select) {
                        select = true
                    }
                }
                if(select) {
                    this.showSetting = true;
                }else {
                    uni.showToast({
                        title: '请选择规格',
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            settingSubmit() {
                for(let i in this.attr) {
                    if(this.attr[i].select) {
                        if(this.setting.price) {
                            this.attr[i].price = this.money(this.setting.price)
                            this.$forceUpdate();
                        }
                        if(this.setting.stock) {
                            this.attr[i].stock = this.setting.stock
                            this.$forceUpdate();
                        }
                        if(this.setting.no) {
                            this.attr[i].no = this.setting.no
                            this.$forceUpdate();
                        }
                        if(this.setting.weight) {
                            this.attr[i].weight = this.setting.weight
                            this.$forceUpdate();
                        }
                    }
                }
                this.close();
            },
            close() {
                this.showSetting = false;
                this.setting.stock = '';
                this.setting.price = '';
                this.setting.no = '';
                this.setting.weight = '';
            },
            unSelect(item,index) {
                this.attr[index].select = !this.attr[index].select;
                let select = true;
                for(let i in this.attr) {
                    if(!this.attr[i].select) {
                        select = false;
                    }
                }
                this.selectStatus = select;
                this.$forceUpdate();
            },
            allSelect() {
                this.selectStatus = !this.selectStatus;
                for(let i in this.attr) {
                    this.attr[i].select = !this.selectStatus;
                    if(this.attr[i].show == this.listLength) {
                        this.attr[i].select = this.selectStatus;
                    }
                }
            },
            save() {
                let that = this;
                let pass = true;
                for(let i in that.attr) {
                    if(!that.attr[i].price || !that.attr[i].stock) {
                        pass = false;
                        uni.showToast({
                            title: '请填写规格信息',
                            icon: 'none',
                            duration: 1000
                        });
                        return false;
                    }
                }
                if(pass) {
                    uni.showLoading({
                        title: '保存中...'
                    });
                    this.$storage.setStorage({
                        key: "temp_attr_info",
                        data: that.attr,
                        success() {
                            uni.hideLoading();
                            setTimeout(() => {
                                uni.navigateBack();
                            }, 500);
                        },
                        fail(res) {
                            uni.hideLoading();
                            uni.showToast({
                                title: res.errMsg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    })
                }
            },
            choose(item,index) {
                this.chooseGroup = item;
                if(this.groupIndex != index) {
                    this.showGroup = true;
                    this.groupIndex = index;
                }else {
                    this.showGroup = !this.showGroup;
                }
            },
            confirm(index,item) {
                this.showGroup = false;
                for(let i in this.attr_groups[this.groupIndex].attr_list) {
                    this.attr_groups[this.groupIndex].attr_list[i].choose = false;
                }
                if(index > -1) {
                    this.chooseAttr = item;
                    item.attr_groups_id = this.attr_groups[this.groupIndex].attr_groups_id;
                    this.attr_groups[this.groupIndex].attr_list[index].choose = true;
                    this.attr_groups[this.groupIndex].choose = true;
                    this.attr_groups[this.groupIndex].choose_attr = this.attr_groups[this.groupIndex].attr_list[index].attr_name;
                }else {
                    this.chooseGroup = {};
                    this.chooseAttr = {};
                    this.attr_groups[this.groupIndex].choose = false;
                    this.attr_groups[this.groupIndex].choose_attr = '';
                }
                this.chooseList = [];
                for(let i in this.attr_groups) {
                    if(this.attr_groups[i].choose) {
                        for(let j in this.attr_groups[i].attr_list) {
                            if(this.attr_groups[i].attr_list[j].choose) {
                                let {attr_group_id, attr_group_name, attr_list} = this.attr_groups[i];
                                this.chooseList.push({
                                    attr_group_id: attr_group_id,
                                    attr_group_name: attr_group_name,
                                    attr_id: attr_list[j].attr_id,
                                    attr_name: attr_list[j].attr_name
                                });
                            }
                        }
                    }
                }
                this.listLength = this.chooseList.length;
                let select = false;
                let showIndex = -1;
                for(let x in this.attr) {
                    this.attr[x].show = 0;
                    this.attr[x].choose = [];
                    this.attr[x].showIndex = -200;
                    if(this.chooseList.length > 0) {
                        for(let y in this.attr[x].attr_list) {
                            for(let i in this.chooseList) {
                                let { attr_group_id, attr_id } = this.attr[x].attr_list[y];
                                if(attr_group_id == this.chooseList[i].attr_group_id && attr_id == this.chooseList[i].attr_id) {
                                    this.attr[x].choose.push(this.chooseList[i].attr_name);
                                    this.attr[x].choose = Array.from(new Set(this.attr[x].choose));
                                    this.attr[x].show = this.attr[x].choose.length;
                                    this.attr[x].showIndex = showIndex;
                                    select = true;
                                    this.$forceUpdate();
                                }
                            }
                        }
                    }else {
                        this.attr[x].showIndex = x;
                    }
                }
                if(!select) {
                    for(let x in this.attr) {
                        this.attr[x].choose = [];
                        this.attr[x].show = this.attr[x].choose.length;
                    }
                }else {
                    for(let x in this.attr) {
                        if(this.attr[x].show == this.listLength) {
                            showIndex++;
                            this.attr[x].showIndex = showIndex;
                        }
                    }
                }
                this.startIndex = -10;
                this.endIndex = 90;
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
            },
            saveData(obj1,obj2,obj3,obj4,obj5) {
                let obj = {};
                obj.attr_list = []
                obj.stock = '';
                obj.price = '';
                obj.no = '';
                obj.weight = '';
                obj.pic_url = '';
                obj.shareLevelList = [];
                obj.member_price = {};
                obj.attr_list.push(obj1)
                if(obj2) {
                    obj.attr_list.push(obj2);
                }
                if(obj3) {
                    obj.attr_list.push(obj3);
                }
                if(obj4) {
                    obj.attr_list.push(obj4);
                }
                if(obj5) {
                    obj.attr_list.push(obj5);
                }
                this.attr.push(obj);
                this.$hideLoading();
            },
        },
        onPageScroll (e) {
            let that = this;
            that.startIndex = Math.floor((e.scrollTop-50) / 250) - 150; // 取得可见区域的起始数据索引
            that.endIndex = that.startIndex + 300; // 取得可见区域的结束数据索引
        },
        onLoad() { this.$commonLoad.onload();
            let that = this;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.unit = that.$storage.getStorageSync('goods_unit') ? that.$storage.getStorageSync('goods_unit') : '件';
            if(that.$storage.getStorageSync('temp_attr_info')) {
                that.attr_groups = that.$storage.getStorageSync('temp_attr');
                that.attr_list[0] = [];
                that.attr = that.$storage.getStorageSync('temp_attr_info');
                for(let i in that.attr) {
                    that.attr[i].show = 0;
                    that.attr[i].choose = [];
                    that.attr[i].id = i;
                    that.attr[i].select = false;
                    that.attr[i].showIndex = i;
                }
                that.$hideLoading();
            }else {
                if(that.$storage.getStorageSync('temp_attr')) {
                    that.attr_groups = that.$storage.getStorageSync('temp_attr');
                    that.attr = [];
                    for(let i = 0;i < that.attr_groups[0].attr_list.length;i++) {
                            let first = {
                                attr_group_id: that.attr_groups[0].attr_group_id,
                                attr_group_name: that.attr_groups[0].attr_group_name,
                                attr_id: that.attr_groups[0].attr_list[i].attr_id,
                                attr_name: that.attr_groups[0].attr_list[i].attr_name,
                            }
                            if(that.attr_groups.length === 1) {
                                that.saveData(first);
                            }else {
                                for(let j = 0;j < that.attr_groups[1].attr_list.length;j++) {
                                        let second = {
                                            attr_group_id: that.attr_groups[1].attr_group_id,
                                            attr_group_name: that.attr_groups[1].attr_group_name,
                                            attr_id: that.attr_groups[1].attr_list[j].attr_id,
                                            attr_name: that.attr_groups[1].attr_list[j].attr_name,
                                        }
                                        if(that.attr_groups.length === 2) {
                                            that.saveData(first,second);
                                        }else {
                                            for(let x = 0;x < that.attr_groups[2].attr_list.length;x++) {
                                                    let third = {
                                                        attr_group_id: that.attr_groups[2].attr_group_id,
                                                        attr_group_name: that.attr_groups[2].attr_group_name,
                                                        attr_id: that.attr_groups[2].attr_list[x].attr_id,
                                                        attr_name: that.attr_groups[2].attr_list[x].attr_name,
                                                    }
                                                    if(that.attr_groups.length === 3) {
                                                        that.saveData(first,second,third);
                                                    }else {
                                                        for(let y = 0;y < that.attr_groups[3].attr_list.length;y++) {
                                                
                                                                let fourth = {
                                                                    attr_group_id: that.attr_groups[3].attr_group_id,
                                                                    attr_group_name: that.attr_groups[3].attr_group_name,
                                                                    attr_id: that.attr_groups[3].attr_list[y].attr_id,
                                                                    attr_name: that.attr_groups[3].attr_list[y].attr_name,
                                                                }
                                                                if(that.attr_groups.length === 4) {
                                                                    that.saveData(first,second,third,fourth);
                                                                    that.$hideLoading();
                                                                }else {
                                                                    for(let z = 0;z < that.attr_groups[4].attr_list.length;z++) {
                                                                        let fifth = {
                                                                            attr_group_id: that.attr_groups[4].attr_group_id,
                                                                            attr_group_name: that.attr_groups[4].attr_group_name,
                                                                            attr_id: that.attr_groups[4].attr_list[z].attr_id,
                                                                            attr_name: that.attr_groups[4].attr_list[z].attr_name,
                                                                        }
                                                                        that.saveData(first,second,third,fourth,fifth);
                                                                    }
                                                                }
                                                        }
                                                    }
                                            }
                                        }
                                }
                            }
                    }
                    for(let i in that.attr) {
                        that.attr[i].show = 0;
                        that.attr[i].choose = [];
                        that.attr[i].id = i;
                        that.attr[i].showIndex = i;
                    }
                }
            }
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
        }
    }
</script>

<style scoped lang="scss">
    .checked-icon {
        background-color: #ff4544;
    }
    .attr-group-holder {
        height: #{100rpx};
    }
    .group {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: #{100rpx};
        background-color: #fff;
        z-index: 100;
        .group-item {
            height: #{50rpx};
            border-left: #{2rpx} solid #e2e2e2;
            .group-name {
                width: #{86rpx};
                font-size: #{28rpx};
                color: #353535;
                text-align: right;
                &.active {
                    color: #ff4544;
                }
            }
            .more {
                display: block;
                width: #{22rpx};
                height: #{12rpx};
                margin-left: #{12rpx};
            }
        }
        .group-item:first-of-type {
            border-left: 0;
        }
    }
    .attr-item {
        min-height: 445rpx;
        .attr-name {
            padding: #{24rpx};
            padding-left: #{96rpx};
            position: relative;
            font-size: #{28rpx};
            color: #353535;
            .check {
                width: #{84rpx};
                height: #{76rpx};
                padding: #{20rpx} #{24rpx};
                position: absolute;
                top: 0;
                left: 0;
                image {
                    width: #{36rpx};
                    height: #{36rpx};
                }
            }
            .attr-group {
                padding-right: #{24rpx};
                height: #{30rpx};
                line-height: #{26rpx};
                border-right: #{2rpx} solid #999999;
                margin-right: #{24rpx};
                margin-bottom: #{8rpx};
                .attr-group-name {
                    color: #999999;
                }
            }
            .attr-group:last-of-type {
                border-right: 0;
            }
        }
    }
    .info-item {
        border-top: #{1rpx} solid #e2e2e2;
        height: #{88rpx};
        line-height: #{88rpx};
        font-size: #{28rpx};
        color: #353535;
        margin: 0 24rpx;
        .form-label {
            width: #{176rpx};
        }
        .input {
            width: #{476rpx};
            background-color: #fff;
            padding-left: #{25rpx};
            font-size: #{28rpx};
            &.input-item {
                height: #{80rpx};
                line-height: #{80rpx};
                white-space: nowrap;
                overflow: auto;
                &.placeholder {
                    color: #cdcdcd;
                }
            }
        }

        .input.unit {
            width: #{396rpx};
        }

        .unit-width {
            width: #{112rpx};
            text-align: right;
        }
    }
    .info-item:first-of-type {
        border-top: 0;
    }
    .bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: #{120rpx};
        background-color: #fff;
        padding: 0 #{24rpx};
        font-size: #{28rpx};
        z-index: 10;
        color: #353535;
        .check {
            width: #{84rpx};
            height: #{84rpx};
            padding: #{24rpx};
            image {
                width: #{36rpx};
                height: #{36rpx};
            }
        }
        .all-setting {
            color: #ff4544;
            margin-left: #{40rpx};
        }
        .save-btn {
            position: absolute;
            right: #{24rpx};
            bottom: #{20rpx};
            height: #{80rpx};
            line-height: #{80rpx};
            width: #{280rpx};
            text-align: center;
            border-radius: #{40rpx};
            background-color: #ff4544;
            font-size: #{32rpx};
            color: #ffffff;
            font-weight: bold;
            &.iphone_x {
                bottom: #{70rpx};
            }
        }
    }
    .bottom.iphone_x {
        height: #{170rpx};
        padding-bottom: #{50rpx};
    }
    .placeholder {
        height: #{140rpx};
    }
    .placeholder.iphone_x {
        height: #{190rpx};
    }
    .bg {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
        z-index: 80;
        &.again {
            z-index: 120;
        }
        .dialog-group {
            position: fixed;
            top: #{100rpx};
            width: 100%;
            border-top: #{2rpx} solid #e2e2e2;
            background-color: #fff;
            padding-left: #{24rpx};
            .dialog-group-name {
                height: #{88rpx};
                line-height: #{88rpx};
                font-size: #{28rpx};
                color: #353535;
                &.active {
                    color: #ff4544;
                }
            }
        }
        .dialog-setting {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 122;
            &.iphone_x {
                padding-bottom: #{50rpx};
            }
            .dialog-setting-title {
                border-top-left-radius: #{16rpx};
                border-top-right-radius: #{16rpx};
                background-color: #f7f7f7;
                height: #{88rpx};
                font-size: #{32rpx};
                color: #353535;
                padding: 0 #{24rpx};
                .dialog-setting-btn {
                    color: #ff4544;
                }
            }
        }
    }
</style>