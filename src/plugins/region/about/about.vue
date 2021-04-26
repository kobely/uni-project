<template>
    <app-layout>
        <view class="about">
            <view>
                <text space='nbsp'>{{about}}</text>
            </view>
        </view>
    </app-layout>
</template>

<script>
    export default {
        data() {
            return {
                about: ''
            }
        },
        methods: {
            getList() {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.region.setting,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.about = response.data.level_up_content;
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
        },
        onLoad(option) { this.$commonLoad.onload(option);
            this.getList();
        },
    }
</script>

<style scoped lang="scss">
    .about {
        position: absolute;
        top: 0;
        left: 0;
        background-color: #fff;
        width: 100%;
        height: 100%;
        z-index: 2;
        view {
            background-color: #fff;
            padding: #{28rpx} #{24rpx};
        }
    }
</style>