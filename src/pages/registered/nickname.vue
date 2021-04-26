<template>
    <view class="bd-nickname">
        <view class="bd-item dir-left-nowrap cross-center">
            <input  class="bd-input box-grow-1" v-model="nickname" placeholder="请输入昵称" type="text">
            <image @click="clear" class="bd-clear" src="/static/image/icon/delete-yuan.png"/>
        </view>
        <view class="bd-comment">
            注：最多可设置16个汉字，可设置含有中文、英文、数字、符号组合的昵称，但不建议设置特殊字符。
        </view>
        <view
            class="bd-bottom"
            :class="agree ? 'bd-yes-agree' : 'bd-no-agree'" @click="changeName">
            确认
        </view>
    </view>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "nickname",
    data() {
        return {
            nickname: ''
        }
    },
    methods: {
        changeName: function() {
            if (!this.agree) return;
            this.nickname = this.nickname.trim();
            this.$request({
                url: this.$api.registered.nickName,
                method: "post",
                data: {
                    nickname: this.nickname
                }
            }).then(response => {
                if (response.code === 0) {
                    uni.navigateBack();
                    this.userInfo.nickname = this.nickname;
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: response.msg
                    });
                }
            });
        },
        clear() {
            this.nickname = ''; 
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.info
        }),
        agree: function() {
            return this.nickname ? 1 : 0;
        }
    },
    mounted() {
        this.nickname = this.userInfo.nickname;
    }
}
</script>

<style scoped>
.bd-nickname {
    min-height: 100vh;
}
.bd-item {
    height: 100upx;
    padding: 46upx 42upx;
    background-color: #ffffff;
    position: relative;
}
.bd-input {
    height: 36upx;
}
.bd-bottom {
    height: 88upx;
    line-height: 88upx;
    color: #ffffff;
    font-size: 36upx;
    border-radius: 44upx;
    margin-top: 68upx;
    text-align: center;
}
.bd-yes-agree {
    background: rgba(255, 69, 68, 1);
}
.bd-no-agree {
    background: rgba(255, 69, 68, 0.5);
}

.bd-comment {
    padding:24upx;
    font-size: 24upx;
    color: #999999;
}

.bd-clear {
    width:25upx;
    height: 25upx;
    position:absolute;
    right: 33upx;
    top:50%;
    transform: translateY(-50%);
}
</style>