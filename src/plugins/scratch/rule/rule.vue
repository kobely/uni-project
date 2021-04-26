<template>
    <view class="app-layout">
        <app-layout>
            <view class="rule">
                <text class="text" space="nbsp" v-text="rules"></text>
            </view>
        </app-layout>
    </view>
</template>

<script>

    export default {
        name: "rule",
        data() {
            return {
                rules: '',
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            const self = this;
            self.$request({
                url: self.$api.scratch.setting,
            }).then(info => {
                if (info.code === 0) {
                    self.rules = info.data.setting.rule;
                }
            });
        }

    }
</script>

<style scoped lang="scss">
    .app-layout /deep/ .app-layout {
        background-color: #FFFFFF;
        min-height: 100vh;
    }

    .rule {
        padding: #{30rpx};

        .text {
            word-break: break-all;
            text-align: justify;
        }
    }
</style>