<template>
    <view class="app-view">
        <view class="app-spring-board dir-top-nowrap main-justify-between">
            <view class="app-text">
                <view class="app-title">网络错误</view>
                <view class="app-content">{{content}}</view>
            </view>
            <view class="app-buttons dir-left-nowrap ">
                <app-form-button @handleClick="copyText" class="app-button">复制错误</app-form-button>
                <app-form-button @handleClick="refreshPage" class="app-button button-border" color="#7e8dae">刷新页面</app-form-button>
            </view>
        </view>
    </view>
</template>

<script>
    import appFormButton from '../app-form-id/app-form-id.vue';

    export default {
        name: 'app-prompt-dialog',
        components: {
            "app-form-button": appFormButton,
        },
        props: {
            content: String,
        },
        computed: {},
        methods: {
            handleClick(boolean) {
                this.$emit('toastModelClick', boolean);
            },
            copyText() {
                this.$store.dispatch('gConfig/reportAndErrorB', false);
                // #ifndef MP-ALIPAY
                this.$utils.uniCopy({
                    data: this.content
                });
                // #endif
                // #ifdef MP-ALIPAY
                my.setClipboard({
                    text: this.content // 剪贴板数据
                });
                // #endif
            },
            refreshPage() {
                this.$store.dispatch('gConfig/reportAndErrorB', false);
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-view {
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0, .3);
        position: absolute;
        z-index: 1501;
        top: 0;
    }
    .app-spring-board {
        background-color: #ffffff;
        width: 80%;
        min-height: 20%;
        position: absolute;
        border-radius: #{10rpx};
        box-shadow: 0 0 #{2rpx} #000000;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -90%);
    }
    .app-buttons {
        width:100%;
        height: #{100rpx};
        border: #{1rpx} solid #dddddd;
    }
    .app-button {
        width: 50%;
    }
    .button-border {
        border-left: #{1rpx} solid #dddddd;
        color: blue;
    }
    .app-button /deep/ form {
        display: block;
        width: 100%;
        height: 100%;
    }
    .app-button /deep/ button {
        display: block;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: #{100rpx};
        background-color: #ffffff;
    }
    .app-title {
        font-weight: bold;
        font-size: #{39rpx};
        text-align: center;
        height: #{70rpx};
        line-height:  #{70rpx};
        margin-top: #{30rpx};
    }
    .app-content {
        padding-left: #{20rpx};
        padding-right: #{20rpx};
        text-align: center;
        margin-bottom: #{30rpx};
        font-size: #{38rpx};
    }
</style>
