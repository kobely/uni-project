<template>
    <app-layout>
        <view v-if="loadingOver" class="page">
            <view class="list">提现比例分{{list.length}}个等级</view>
            <view class="list" v-for="item in list" :key="item.id">
                <text v-if="item.update_type == 0">分销佣金</text>
                <text v-if="item.update_type == 1">已提现佣金</text>
                <text v-if="item.update_type == 2">下线人数</text>
                <text v-if="item.update_type == 3">下线分销商数</text>
                <text v-if="item.update_type == 4">下级队长数</text>
                <text>达到{{item.update_condition}}</text>
                <text v-if="item.update_type > 1">人,</text>
                <text v-if="item.update_type < 2">元,</text>
                <text>提成等级比例为{{item.rate}}%</text>
            </view>
        </view>
    </app-layout>
</template>

<script>

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                loadingOver: false,
                list: []
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                bonusImg: state => state.mallConfig.__wxapp_img.bonus
            })
        },
        methods: {
            getList() {
                this.$request({
                    url: this.$api.bonus.member,
                }).then(response=>{
                    this.$hideLoading();
                    if(response.code === 0) {
                        this.list = response.data.list;
                        this.loadingOver = true;
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
            that.getList();
        }
    }
</script>

<style scoped lang="scss">
    .page {
        font-size:#{28rpx};
        color:#353535;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #fff;
        padding: #{28rpx} 0;
    }

    .list {
        background-color: #fff;
        padding: 0 #{28rpx};
    }
</style>