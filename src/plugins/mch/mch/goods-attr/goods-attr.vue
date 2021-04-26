<template>
    <app-layout>
        <view>
            <view class="attr" v-for="(item,index) in list" :key="index">
                <image @click='pop(index)' class='low-attr' src='./../../image/low.png'></image>
                <view class="attr-item dir-left-nowrap">
                    <view class="attr-label">规格名</view>
                    <view class='dir-left-nowrap cross-center'>
                        <input placeholder-style="color: #cdcdcd" placeholder="请输入规格" @input="changeName(item)" class='input' v-model="item.attr_group_name"/>
                    </view>
                </view>
                <view class="attr-item dir-left-nowrap">
                    <view class="attr-label">规格值</view>
                    <view @click="changeValue(index)">
                        <view class="attr_name" v-if="item.attr_list.length > 0">
                            <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                            <view class="attr-name-list t-omit">
                                <text v-for="(attr,idx) in item.attr_list" :key="idx"><text v-if="idx !== 0">；</text>{{attr.attr_name}}</text>
                            </view>
                        </view>
                        <view v-else class='cat-info dir-right-nowrap cross-center'>
                            <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                            <text style="color: #cdcdcd">未选择</text>
                        </view>
                    </view>
                    <view>
                    </view>
                </view>
            </view>
        </view>
        <view class='title'>设置价格、库存等规格明细</view>
        <view class='info-item cross-center main-between'>
            <view class="form-label">规格明细</view>
            <view @click="chooseDetail">
                <view class='cat-info dir-right-nowrap cross-center'>
                    <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                    <text v-if="attr.length > 0">已设置</text>
                    <text style="color: #cdcdcd" v-else>未设置，点击设置</text>
                </view>
            </view>
        </view>
        <view v-if="list.length < 5" class='add-attr' @click='add_attr'>
            <view class='add-attr-btn main-center'>
                <image src='./../../image/add.png'></image>
                <view>增加规格</view>
            </view>
        </view>
        <view :class="['placeholder', `${iphone_x? 'iphone_x':''}`]"></view>
        <view :class="['add', `${iphone_x? 'iphone_x':''}`]">
            <view @click="save">保存</view>
        </view>
        <view class='dialog' v-if="index > -1">
            <view class='dialog-item'>
                <view class='dialog-title'>确定删除这个规格吗？</view>
                <view class="submit-info">删除后，规格名与规格值都将被删除</view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='close'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='toDelete'>确认</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>

    export default {
        data() {
            return {
                list: [],
                attr: [],
                iphone_x: false,
                noDetail: true,
                first: true,
                index: -1,
            }
        },

        methods: {
            changeName(item) {
                let that = this;
                if(this.attr.length > 0) {
                    for(let i in this.attr) {
                        for(let j in this.attr[i].attr_list) {
                            if(item.attr_group_id == this.attr[i].attr_list[j].attr_group_id) {
                                this.attr[i].attr_list[j].attr_group_name = item.attr_group_name;
                            }
                        }
                    }
                    this.$storage.setStorageSync('temp_attr_info', that.attr);
                    uni.hideLoading();
                }
            },
            pop(index) {
                this.index = index;
                if(!this.list[this.index].attr_group_name && this.list[this.index].attr_list.length === 0) {
                    this.list.splice(this.index,1);
                    this.index = -1;
                    this.attr = [];
                    this.$storage.removeStorageSync('temp_attr_info');
                }
            },
            close() {
                this.index = -1;
            },
            changeValue(index) {
                this.$storage.setStorageSync('temp_attr', this.list);
                uni.navigateTo({
                    url: `/plugins/mch/mch/goods-attr-edit/goods-attr-edit?index=${index}`
                })
            },
            chooseDetail() {
                if(this.list.length === 0) {
                    uni.showToast({
                        title: '请输入规格信息',
                        icon: 'none',
                        duration: 1000
                    });
                    return false
                }else {
                    let number = 1;
                    for(let i in this.list) {
                        number *= +this.list[i].attr_list.length;
                    }
                    if(number > 1000) {
                        uni.showToast({
                            title: '规格组合超出1000，请删减规格值再继续操作',
                            icon: 'none',
                            duration: 1000
                        });
                        return false
                    }
                }
                for(let i in this.list) {
                    if(!this.list[i].attr_group_name || this.list[i].attr_list.length == 0) {
                        uni.showToast({
                            title: '请完善规格信息',
                            icon: 'none',
                            duration: 1000
                        });
                        return false;
                    }
                }
                this.$storage.setStorageSync('temp_attr', this.list);
                uni.navigateTo({
                    url: '/plugins/mch/mch/goods-attr-info/goods-attr-info'
                })
            },
            toDelete() {
                this.list.splice(this.index,1);
                this.index = -1;
                this.attr = [];
                this.$storage.removeStorageSync('temp_attr_info');
            },
            save() {
                let that = this;
                if(that.list.length === 0) {
                    uni.showToast({
                        title: '请输入规格信息',
                        icon: 'none',
                        duration: 1000
                    });
                    return false
                }
                for(let i in that.list) {
                    if(!that.list[i].attr_group_name || that.list[i].attr_list.length === 0 || that.attr.length === 0) {
                        uni.showToast({
                            title: '请完善规格信息',
                            icon: 'none',
                            duration: 1000
                        });
                        return false;
                    }
                }
                this.$storage.setStorageSync('goods_attr_groups', this.list);
                uni.showLoading({
                    mask: true,
                    title: '保存中...'
                });
                this.$storage.setStorageSync('goods_attr', this.attr);
                setTimeout(function() {
                    uni.hideLoading();
                    uni.navigateBack();
                }, 500);
                uni.setStorage({
                    key: "goods_attr_groups",
                    data: that.list
                })
            },
            add_attr() {
                this.list.push({
                    attr_group_id: this.list.length + 1,
                    attr_group_name: '',
                    attr_list: []
                });
                this.attr = [];
                uni.removeStorage({
                    key: 'temp_attr_info'
                });
            }
        },

        onLoad() { this.$commonLoad.onload();
            let that = this;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            let loadAttr = false;
            if(that.$storage.getStorageSync('goods_attr_groups')) {
                that.list = that.$storage.getStorageSync('goods_attr_groups');
                that.$storage.setStorageSync('temp_attr', that.list);
                loadAttr = true;
            }else {
                that.list = that.$storage.getStorageSync('temp_attr');
                loadAttr = true;
            }
            if(that.$storage.getStorageSync('goods_attr')) {
                that.attr = that.$storage.getStorageSync('goods_attr');
                that.$storage.setStorageSync('temp_attr_info', that.$storage.getStorageSync('goods_attr'));
                that.$hideLoading();
                that.first = false;
            }else {
                that.first = false;
                that.$hideLoading();
            }
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
        },
        onShow() {
            let that = this;
            if(!this.first) {
                that.list = that.$storage.getStorageSync('temp_attr') ? that.$storage.getStorageSync('temp_attr') : [];
                that.attr = that.$storage.getStorageSync('temp_attr_info') ? that.$storage.getStorageSync('temp_attr_info') : [];
            }
        }
    }
</script>

<style scoped lang="scss">
    .attr {
        background-color: #fff;
        position: relative;
        padding-left: #{84rpx};
        margin-bottom: #{20rpx};
        .low-attr {
            position: absolute;
            z-index: 2;
            top: #{24rpx};
            height: #{40rpx};
            width: #{40rpx};
            left: #{24rpx};
        }
        .attr-item {
            height: #{88rpx};
            line-height: #{88rpx};
            border-top: #{2rpx} solid #e2e2e2;
            position: relative;
            font-size: #{28rpx};
            color: #999;
            color: #353535;
            .attr-label {
                width: #{174rpx};
                flex-shrink: 0;
            }
            .attr_name {
                .to-more {
                    right: #{24rpx};
                    top: #{32rpx};
                    position: absolute;
                    margin-left: 0;
                }
                .attr-name-list {
                    width: #{432rpx};
                }
            }
            .cat-info {
                width: #{442rpx};
            }
            .to-more {
                height: #{24rpx};
                width: #{12rpx};
                margin-left: #{10rpx};
            }
        }
        .attr-item:first-of-type {
            border-top: 0;
        }
    }
    .title {
        font-size: #{28rpx};
        color: #999;
        margin: #{30rpx} #{24rpx} #{13rpx};
    }
    .info-item {
        height: #{88rpx};
        line-height: #{88rpx};
        font-size: #{28rpx};
        background-color: #fff;
        padding: 0 #{24rpx};
        color: #353535;
        .form-label {
            width: #{176rpx};
        }
        .cat-info {
            width: #{526rpx};
            color: #666;
            .to-more {
                height: #{24rpx};
                width: #{12rpx};
                margin-left: #{10rpx};
            }
        }
    }

    .add-attr {
        height: #{120rpx};
        background-color: #fff;
        margin-top: 20rpx;
        padding-top: #{24rpx};
        .add-attr-btn {
            height: #{72rpx};
            width: #{320rpx};
            border-radius: #{36rpx};
            border: #{2rpx} solid #ff4544;
            margin: 0 auto;
            color: #ff4544;
            font-size: #{26rpx};
            line-height: #{72rpx};
            image {
                height: #{28rpx};
                width: #{28rpx};
                margin-right: #{12rpx};
                margin-top: #{22rpx};
            }
        }
    }
    .add {
        position: fixed;
        bottom: 0;
        left: 0;
        height: #{120rpx};
        width: 100%;
        z-index: 15;
        background-color: #fff;
        view {
            width: #{702rpx};
            line-height: #{80rpx};
            height: #{80rpx};
            margin: #{20rpx} auto;
            border-radius: #{40rpx};
            background-color: #ff4544;
            color: #fff;
            font-size: #{32rpx};
            text-align: center;
        }
    }
    .add.iphone_x {
        height: #{170rpx};
        padding-bottom: #{50rpx};
    }
    .placeholder {
        height: #{120rpx};
    }
    .placeholder.iphone_x {
        height: #{170rpx};
    }
    .dialog {
        position: fixed;
        height: 100%;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, .3);
        .dialog-item {
            padding-top: #{20rpx};
            position: fixed;
            top: 25%;
            left: 0;
            right: 0;
            margin: 0 auto;
            width: #{620rpx};
            border-radius: #{16rpx};
            background-color: #fff;
            text-align: center;
        }
        .submit-info {
            font-size: #{28rpx};
            color: #999999;
            padding: #{34rpx} 0 #{52rpx};
        }
        .btn-area {
            height: #{88rpx};
            position: relative;
            border-top: #{1rpx} solid #e2e2e2;
            .line {
                height: #{32rpx};
                width: #{1rpx};
                background-color: #e2e2e2;
                position: absolute;
                top: #{28rpx};
                left: 0;
                right: 0;
                margin: 0 auto;
            }
            .submit-btn {
                height: #{88rpx};
                line-height: #{88rpx};
                font-size: #{32rpx};
                color: #666;
                width: #{310rpx};
                text-align: center;
            }
            .submit-btn.be-submit {
                color: #ff4544;
            }
        }
        .dialog-title {
            text-align: center;
            font-size: #{32rpx};
            color: #353535;
            margin: #{23rpx} 0 0;
        }
    }
</style>