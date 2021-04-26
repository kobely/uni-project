<template>
    <app-layout>
        <view class='add-attr' @click='add_attr'>
            <view class='add-attr-btn main-center'>
                <image src='./../../image/add.png'></image>
                <view>增加规格值</view>
            </view>
        </view>
        <view>
            <view class="attr" v-for="(item, index) in list" :key="index">
                <image @click='pop(index)' class='low-attr' src='./../../image/low.png'></image>
                <view class="attr-item">
                    <input placeholder-style="color: #cdcdcd" placeholder="请输入规格值" class='input' v-model="item.attr_name"/>
                </view>
            </view>
        </view>
        <view :class="['placeholder', `${iphone_x? 'iphone_x':''}`]"></view>
        <view :class="['add', `${iphone_x? 'iphone_x':''}`]">
            <view @click="save">保存</view>
        </view>
        <view class='dialog' v-if="index > -1">
            <view class='dialog-item'>
                <view class='dialog-title'>确定删除这个规格值吗？</view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='close'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='toDelete'>删除</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        data() {
            return {
                iphone_x: false,
                detail: {},
                index: -1,
                list: [],
                idx: -1,
                attrList: [],
                attr: []
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info
            })
        },
        methods: {
            pop(index) {
                this.index = index;
            },
            close() {
                this.index = -1;
            },
            add_attr() {
                this.list.push({
                    attr_id: this.list.length > 0 ? +this.list[this.list.length -1].attr_id + 1 : 1,
                    attr_name: '',
                    pic_url: ''
                });
            },
            toDelete() {
                let arr = [];
                for(let i in this.attrList) {
                    for(let y in this.attrList[i].attr_list) {
                        let { attr_group_id, attr_id } = this.attrList[i].attr_list[y];
                        if(attr_group_id == this.attr[this.idx].attr_group_id && attr_id == this.list[this.index].attr_id) {
                            arr.unshift(i);
                        }
                    }
                }
                for(let i in arr) {
                    this.attrList.splice(arr[i],1);
                }
                this.list.splice(this.index,1);
                this.index = -1;
            },
            save() {
                for(let i in this.list) {
                    if(!this.list[i].attr_name) {
                        uni.showToast({
                            title: '请输入规格值',
                            icon: 'none',
                            duration: 1000
                        });
                        return false
                    }
                    for(let j in this.list) {
                        if(i !== j && this.list[i].attr_name === this.list[j].attr_name) {
                            uni.showToast({
                                title: '同一规格组下，规格名不能重复',
                                icon: 'none',
                                duration: 1000
                            });
                            return false
                        }
                    }
                }

                let change = false;
                if(this.list.length > this.attr[this.idx].attr_list.length) {
                    change = true;
                }

                for(let i in this.attrList) {
                    for(let y in this.attrList[i].attr_list) {
                        for(let j in this.list) {
                            let { attr_group_id, attr_id } = this.attrList[i].attr_list[y];
                            if(attr_group_id == this.attr[this.idx].attr_group_id && attr_id == this.list[j].attr_id) {
                                this.attrList[i].attr_list[y].attr_name = this.list[j].attr_name;
                            }
                        }
                    }
                }
                uni.showLoading({
                    title: '保存中...'
                });
                if(change) {
                    this.$storage.removeStorageSync('temp_attr_info');
                }else {
                    if(this.attrList.length === 0) {
                        this.$storage.removeStorageSync('temp_attr_info');
                    }else {
                        this.$storage.setStorageSync('temp_attr_info', this.attrList);
                    }
                }
                this.attr[this.idx].attr_list = this.list;
                this.$storage.setStorageSync('temp_attr', this.attr);
                setTimeout(function() {
                    uni.navigateBack();
                }, 500)
            },
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            this.idx = options.index;
            if(that.$storage.getStorageSync('temp_attr')) {
                that.attr = that.$storage.getStorageSync('temp_attr');
                that.detail = that.attr[options.index];
                that.list = JSON.parse(JSON.stringify(that.detail.attr_list));
            }
            that.attrList = that.$storage.getStorageSync('temp_attr_info') ? that.$storage.getStorageSync('temp_attr_info') : [];
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
            color: #353535;
            input {
                height: #{88rpx};
                line-height: #{88rpx};
            }
        }
        .attr-item:first-of-type {
            border-top: 0;
        }
    }
    .add-attr {
        height: #{120rpx};
        background-color: #fff;
        margin-bottom: #{20rpx};
        padding-top: #{24rpx};
        .add-attr-btn {
            height: #{72rpx};
            width: #{320rpx};
            border-radius: #{36rpx};
            border: #{1rpx} solid #ff4544;
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
            font-size: 32rpx;
            color: #353535;
            margin: #{66rpx} 0 #{76rpx};
        }
    }
</style>