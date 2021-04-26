<template>
    <view class="bd-setting">
        <view @click="router('/pages/registered/authentication')" class="bd-item dir-left-nowrap main-between cross-center">
            <text>手机号</text>
            <view>
                <text>{{userInfo && userInfo.mobile | setIphone}}</text>
                <image src="/static/image/icon/arrow-right.png" class="bd-arrow"></image>
            </view>
        </view>
        <view @click="router('/pages/registered/password')" class="bd-item dir-left-nowrap main-between cross-center">
            <text>登入密码</text>
            <view>
                <text>修改</text>
                <image src="/static/image/icon/arrow-right.png" class="bd-arrow"></image>
            </view>
        </view>
        <view class="bd-item dir-left-nowrap main-between cross-center" @click="setAvatar">
            <text>头像</text>
            <view class="cross-center">
                <image class="bd-avatar" :src="userInfo.avatar"></image>
                <image src="/static/image/icon/arrow-right.png" class="bd-arrow"></image>
            </view>
        </view>
        <view @click="router('/pages/registered/nickname')" class="bd-item dir-left-nowrap main-between cross-center">
            <text>昵称</text>
            <view>
                <text>{{userInfo.nickname}}</text>
                <image src="/static/image/icon/arrow-right.png" class="bd-arrow"></image>
            </view>
        </view>
        <view class="bd-btn" @click="logOut">退出登入</view>
    </view>
</template>

<script>
    import {mapState} from 'vuex';
    import uploadFile from "@/core/upload";
    export default {
        name: "setting",

        computed: {
            ...mapState({
                userInfo: state => state.user.info
            })
        },
        filters: {
            setIphone(data) {
                return data && data.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
            }
        },
        methods: {
            router(data) {
                uni.navigateTo({
                    url: data
                })
            },
            logOut() {
                this.$request({
                    url: this.$api.registered.logout,

                }).then(res => {
                    if (res.code === 0) {
                        this.$store.dispatch('user/logout');
                        uni.navigateBack();
                    }
                })
            },
            setAvatar() {
                let _this = this;
                uni.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'],
                    success(res) {
                        uni.uploadFile({
                            url: _this.$api.upload.file,
                            filePath: res.tempFilePaths[0],
                            name: 'file',
                            success(response) {
                                _this.userInfo.avatar = JSON.parse(response.data).data.url;
                                _this.$request({
                                    url: _this.$api.registered.avatar,
                                    method: 'post',
                                    data: {
                                        avatar: JSON.parse(response.data).data.url
                                    }
                                })
                            }
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped >
    .bd-setting {
        padding: 0 24upx;
        background-color: #ffffff;
    }
    .bd-item {
        height: 100upx;
        font-size: 28upx;
        color: #353535;
        border-bottom: 2upx solid #f4f4f4;
    }
    .bd-arrow {
        width: 12upx;
        height: 22upx;
        margin-left:20upx;
    }
    .bd-btn {
        text-align: center;
        height: 100upx;
        line-height: 100upx;
        position: fixed;
        bottom: 30upx;
        width: 702upx;
        color: #353535;
        border-radius: 16upx;
        box-shadow: 0 0 8upx rgba(0, 0, 0, .05);
        background-color: #ffffff;
    }
    .bd-avatar {
        width: 80upx;
        height: 80upx;
    }

</style>