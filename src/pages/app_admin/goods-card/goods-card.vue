<template>
    <view style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;background-color: #fff">
        <app-layout>
            <view class="title">{{list.length > 0 ? '已添加卡券' : '未添加卡券'}}</view>
            <view class="card-list">
                <view class='main-between card-item' v-for="(item,index) in list" :key="item.id">
                    <view class='card-info dir-left-nowrap' style="width: 80%">
                        <view @click="close(index)" class="card-img">
                            <image src='./../image/low.png'></image>
                        </view>
                        <view @click="add(index,item)" class="t-omit">{{item.name}}</view>
                    </view>
                    <view>{{item.num}}</view>
                </view>
            </view>
            <view :class="['add main-between', `${iphone_x? 'iphone_x':''}`]">
                <view class="add-btn" @click="add">添加卡券</view>
                <view class="save-btn" @click="save">保存</view>
            </view>
            <view class="dialog" v-if="to_add">
                <view class="dialog-content">
                    <view class="dialog-title">选择卡券</view>
                    <view class="main-between choose-item">
                        <view class='label'>选择卡券</view>
                        <view @click='showDialog' class='cat-info dir-right-nowrap cross-center'>
                            <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                            <text class="t-omit" v-if="beCard && beCard.id > 0">{{beCard.name}}</text>
                            <text v-else>未选择</text>
                        </view>
                    </view>
                    <view class="main-between choose-item" style="border-bottom: 0">
                        <view class='label'>填写张数(张)</view>
                        <input type="number" maxlength="3" class="number-input" v-model="num">
                    </view>
                    <view class="main-center btn-area">
                        <view class="submit-btn" @click='cancel'>取消</view>
                        <view class="line"></view>
                        <view class="submit-btn be-submit" @click='submit'>确认</view>
                    </view>
                </view>
            </view>
            <view :class="['dialog', `${iphone_x?'iphone_x':''}`]" v-if="dialog">
                <view class="picker-list">
                    <view class="main-between picker-header">
                        <view @click="toggle">取消</view>
                        <view @click="toggle(1)">确定</view>
                    </view>
                    <picker-view class="picker" :value="[newIndex]" @change="bindChange">
                        <picker-view-column>
                            <view
                                v-for="(item,idx) in card" :key="item.id"
                                :class="[`picker-item`,{
                                    'sure-color': newIndex == idx,
                                    'cardinal-color': newIndex == idx + 1 || newIndex == idx - 1,
                                    'even-color': newIndex == idx + 2 || newIndex == idx - 2,
                                }]">
                                {{item.name}}
                            </view>
                        </picker-view-column>
                    </picker-view>
                </view>
            </view>
        </app-layout>
    </view>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        data() {
            return {
                iphone_x: false,
                card: [],
                list: [],
                modal: false,
                page_loading: true,
                to_add: false,
                num: 1,
                beCard: null,
                index: -1,
                dialog: false,
                newIndex: 0,
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin
            })
        },
        methods: {
            showDialog() {
                this.dialog = !this.dialog;
            },
            getCard() {
                let that = this;
                that.$request({
                    url: that.$api.app_admin.card,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code === 0) {
                        that.cat = response.data.list;
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
            bindChange(e) {
                this.newIndex = e.detail.value[0];
            },
            toggle(status) {
                this.dialog = false;
                if (status == 1) {
                    this.beCard = this.card[this.newIndex];
                    this.newIndex = 0;
                }
            },
            close(index) {
                this.list.splice(index, 1);
            },
            submit() {
                if (this.beCard != null) {
                    this.beCard.num = this.num;
                    if(this.index > -1) {
                        this.list[this.index] = this.beCard;
                    }else {
                        this.list.push(this.beCard);
                    }
                    this.num = null;
                    this.to_add = false;
                }else {
                    uni.showToast({
                        title: '请选择卡券',
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            save() {
                this.$storage.setStorageSync('goods_card', this.list);
                setTimeout(function() {
                    uni.navigateBack();
                }, 500);
            },
            cancel() {
                this.to_add = false;
                this.beCard = null;
            },
            add(index,item) {
                this.$request({
                    url: this.$api.app_admin.card,
                }).then(response => {
                    this.$hideLoading();
                    if(response.code === 0) {
                        let card = response.data.list;
                        this.num = 1;
                        if (card.length > 0) {
                            this.to_add = true;
                            if(index > -1) {
                                this.beCard = this.list[index];
                                this.num = item.num;
                                this.index = index;
                                for(let i in card) {
                                    if(card[i].id == this.beCard.id) {
                                        this.newIndex = i;
                                    }
                                }
                            }else {
                                this.index = -1;
                                this.newIndex = 0;
                                this.beCard = null;
                            }
                        } else {
                            uni.showToast({
                                title: '暂无可添加卡券',
                                icon: 'none',
                                duration: 1000
                            });
                        }
                        this.card = card;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    this.$hideLoading();
                });
            },
        },

        onLoad() { this.$commonLoad.onload();
            let that = this;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.list = this.$storage.getStorageSync('goods_card') ? this.$storage.getStorageSync('goods_card') : [];
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
            that.getCard();
        }
    }
</script>

<style scoped lang="scss">
    .title {
        font-size: #{32rpx};
        color: #999999;
        padding-top: #{36rpx};
        background-color: #fff;
        text-align: center;
    }

    .add.iphone_x {
        height: #{170rpx};
        padding-bottom: #{50rpx};
    }

    .add {
        height: #{120rpx};
        padding: 0 #{24rpx};
        margin: 0 auto;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        border-top: #{2rpx} solid #e2e2e2;
        background-color: #fff;
        .add-btn {
            background-color: #fff;
            color: #446dfd;
            border: #{2rpx} solid #446dfd;
        }
    }

    .add>view {
        height: #{80rpx};
        width: #{300rpx};
        margin-top: #{20rpx};
        border-radius: #{40rpx};
        background-color: #446dfd;
        color: #fff;
        font-size: #{28rpx};
        text-align: center;
        line-height: #{80rpx};
    }

    .card-item {
        height: #{64rpx};
        line-height: #{40rpx};
        padding-bottom: #{24rpx};
        font-size: #{32rpx};
        background-color: #fff;
    }

    .card-list {
        background-color: #fff;
        padding: #{40rpx};
        padding-bottom: #{120rpx};
        overflow: auto;
    }

    .card-info {
        color: #353535;
    }

    .card-img {
        height: #{40rpx};
        width: #{40rpx};
        margin-right: #{20rpx};
    }

    .card-img image {
        height: #{40rpx};
        width: #{40rpx};
    }

    .cat-info {
        width: #{300rpx};
        color: #666;
        font-size: #{28rpx};
        padding-right: #{8rpx};
    }

    .to-more {
        height: #{24rpx};
        width: #{12rpx};
        margin-left: #{10rpx};
    }

    .label {
        width: #{240rpx};
        font-size: #{28rpx};
        color: #353535;
        text-align: left;
        padding-left: #{8rpx};
    }

    .dialog {
        position: fixed;
        height: 100%;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 9999;
        background-color: rgba(0, 0, 0, .3);
    }

    .dialog.iphone_x .picker-list{
        padding-bottom: #{50rpx};
    }

    .picker {
        width: 100%;
        height: #{440rpx};
        color:#999999;
    }


    .dialog.iphone_x .picker{
        height:#{490rpx};
    }

    .picker-list {
        background-color: #fff;
        padding-top: #{20rpx};
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 9999;
    }

    .picker-header {
        padding: 0 #{24rpx};
        color: #446dfd;
        font-size: #{32rpx};
    }

    .dialog-title {
        font-size: #{32rpx};
        color: #353535;
        margin: 0 auto #{30rpx};
        text-align: center;
    }


    .dialog-content {
        margin: 40% auto;
        padding-top: #{35rpx};
        width: #{620rpx};
        border-radius: #{16rpx};
        background-color: #fff;
        .choose-item {
            margin: 0 #{40rpx};
            height: #{90rpx};
            line-height: #{90rpx};
            border-bottom: #{2rpx} solid #e2e2e2;
            input {
                height: #{90rpx};
                line-height: #{90rpx};
                font-size: #{28rpx};
                color: #666;
            }
        }
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
        color: #446dfd;
    }

    .btn-area {
        height: #{88rpx};
        position: relative;
        border-top: #{2rpx} solid #e2e2e2;
        width: 100%;
        margin-top: #{30rpx};
    }

    .btn-area .line {
        height: #{32rpx};
        width: #{1rpx};
        background-color: #e2e2e2;
        position: absolute;
        top: #{28rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
    }

    .dialog {
        position: fixed;
        height: 100%;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 9999;
        background-color: rgba(0, 0, 0, .3);
    }

    .picker-item {
        line-height: #{88rpx};
        font-size: #{32rpx};
        padding-left: #{24rpx};
    }

    .picker-item.sure-color {
        color: #446dfd;
    }
    .picker-item.cardinal-color {
        color: #999999;
    }
    .picker-item.even-color {
        color: #cdcdcd;
    }
</style>