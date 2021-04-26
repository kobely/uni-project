<template>
    <app-layout>
        <view>
            <view class="input-list">
                <view class="dir-left-nowrap input-item">
                    <view class='label'>收货人</view>
                    <input name="name" v-model="name"></input>
                </view>
                <view class="dir-left-nowrap input-item">
                    <view class='label'>联系电话</view>
                    <input name="mobile" type="number" v-model="mobile"></input>
                </view>
                <view class="main-between input-item">
                    <text class="label">所在地区</text>
                    <app-area-picker @customevent="areaEvent"
                                     :ids="ids"></app-area-picker>
                </view>
                <view class="dir-left-nowrap input-item">
                    <view class='label'>详细地址</view>
                    <input name="detail" placeholder="请输入详细地址(最多50字)" maxlength="50" v-model="detail"></input>
                </view>
            </view>
            <button @click="saveAddress" class='address-bottom'>{{!changeAddress ? '确认修改地址' : '确定'}}</button>
        </view>
    </app-layout>
</template>

<script>
    import appAreaPicker from '../../../components/page-component/app-area-picker/app-area-picker.vue';

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                ids: [0],
                list: [],
                name: '',
                mobile: '',
                detail: '',
                order_no: '',
                province: '',
                city: '',
                district: '',
                order: {},
                changeAddress: false
            }
        },
        components: {
            "app-area-picker": appAreaPicker
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin,
            })
        },
        methods: {
            areaEvent(data) {
                if (data) {
                    this.province = data.province.name;
                    this.city = data.city.name;
                    this.district = data.district.name;
                }
            },
            getDistrict() {
                let that = this;
                that.$showLoading({
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.default.district
                }).then(response=>{
                    if(response.code == 0) {
                        that.list = response.data.list;
                        that.getList();
                    }else {
                        that.$hideLoading();
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
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.app_admin.order,
                    data: {
                        status: '-1',
                        keyword: that.order_no
                    },
                    method: 'post'
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.order = response.data.list[0];
                        that.name = response.data.list[0].name;
                        that.mobile = response.data.list[0].mobile;
                        if(!response.data.list[0].address) {
                            that.changeAddress = true;
                            uni.setNavigationBarTitle({
                                title: '添加收货地址'
                            });
                            return false;
                        }
                        let arr = response.data.list[0].address.trim().split(" ");
                        that.detail = arr[arr.length - 1];
                        let firstList = that.list;
                        that.ids = [];
                        firstList.forEach(function(row){
                            if (row.name == arr[0]) {
                                that.ids[0] = row.id;
                                let secList = row
                                secList.list.forEach(function(res){
                                    if (res.name == arr[1]) {
                                        that.ids[1] = res.id;
                                        let thirList = res;
                                        thirList.list.forEach(function (e) {
                                            if (e.name == arr[2]) {
                                                that.ids[2] = e.id;
                                            }
                                        })
                                    }
                                })
                            }
                        })
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
            saveAddress: function (e) {
                let that = this;
                if (!that.province) {
                    uni.showToast({
                        title: '地区不能为空',
                        icon: 'none',
                        duration: 1000,
                    });
                    return;
                }
                uni.showLoading({
                    mask: true,
                    title: '提交中...'
                });
                that.$request({
                    url: that.$api.app_admin.update_address,
                    method: "POST",
                    data: {
                        order_id: that.order.id,
                        name: that.name,
                        mobile: that.mobile,
                        province: that.province,
                        city: that.city,
                        district: that.district,
                        address: that.detail,
                    }
                }).then(response => {
                    uni.hideLoading();
                    if (response.code == 0) {
                        uni.showToast({
                            title: response.msg,
                            duration: 1000,
                            icon: 'success',
                            mask: false
                        });
                        setTimeout(function(){
                            uni.navigateBack();
                        },500)
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                    uni.showToast({
                        title: response,
                        icon: 'none',
                        duration: 1000
                    });
                });

            },
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            if (options.order_no) {
                that.order_no = options.order_no
                that.getDistrict();
            }
        }
    }
</script>

<style scoped lang="scss">
    .address-bottom {
        width: #{702rpx};
        height: #{80rpx};
        line-height: #{80rpx};
        border-radius: #{40rpx};
        padding: 0;
        text-align: center;
        margin: #{40rpx} auto;
        color: #fff;
        z-index: 7;
        font-size: #{28rpx};
        background-color: #446dfd;
    }

    .input-list {
        background-color: #fff;
        padding-left: #{30rpx};
    }

    .input-item {
        border-bottom: #{1rpx} solid #eee;
        padding: #{24rpx} #{30rpx} #{24rpx} 0;
        height: #{96rpx};
        font-size: #{28rpx};
        color: #495060;
    }

    .input-item:last-of-type {
        border-bottom: 0;
    }

    .input-item .label {
        width: 20%;
        height: #{48rpx};
        line-height: #{48rpx};
    }

    .input-item input {
        width: 80%;
        height: #{48rpx};
        line-height: #{48rpx};
        font-size: #{28rpx};
    }
</style>