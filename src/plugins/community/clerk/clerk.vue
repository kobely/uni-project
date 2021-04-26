<template>
    <app-layout>
        <view v-if="list.length == 0" class="search dir-top-nowrap cross-center">
            <view class="input">
                <input v-model="keyword" placeholder="请输入买家手机号" type="number">
            </view>
            <app-button :theme="getTheme" color="#fff" @click="getList" arrangement="row" type="important" round width="702">
                <text class="app-text">确认</text>
            </app-button>
        </view>
        <view v-else>
            <app-order v-for="(item,index) in list" :key="item.id" v-on:update="update" v-if="item.is_confirm == 0" :is_user="is_user" :theme="getTheme" :item="item"></app-order>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appOrder from '../components/app-order';

    export default {
        data() {
            return {
                middleman: {},
                setting: {},
                more_list: false,
                page: 1,
                list: [],
                keyword: '',
                apply_at: ''
            }
        },
        components: {
            "app-order": appOrder
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                stock: state => state.mallConfig.__wxapp_img.stock,
                bonusImg: state => state.mallConfig.__wxapp_img.bonus,
                userInfo: state => state.user.info,
            })
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.getStatus();
        },
        methods: {
            update(e) {
                for(let index in this.list) {
                    if(this.list[index].id == e.id) {
                        this.list.splice(index,1);
                    }
                }
                this.$forceUpdate();
            },
            getStatus() {
                let that = this;
                that.$request({
                    url: that.$api.community.index,
                }).then(response=>{
                    if(response.code == 0) {
                        this.setting = response.data.setting;
                        if(response.data.middleman.id > 0) {
                            this.middleman = response.data.middleman;
                            this.apply_at = this.middleman.apply_at.substring(0,10)
                        }else {
                            uni.showToast({
                                title: '您还不是团长，现在前往申请页面',
                                icon: 'none',
                                duration: 1000
                            });
                            setTimeout(function(){
                                uni.redirectTo({
                                    url: '/plugins/community/apply/apply'
                                });
                            },1000)
                        }
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
            getList() {
                let that = this;
                if(!that.keyword) {
                    uni.showToast({
                        title: '请输入买家手机号',
                        icon: 'none',
                        duration: 1000
                    });
                    return false
                }
                if(that.loading) {
                    return false
                }
                that.loading = true;
                that.$request({
                    url: that.$api.community.middle_list,
                    data: {
                        status: 3,
                        keyword: that.keyword,
                        page: that.page,
                    }
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    that.loading = false;
                    if(response.code == 0) {
                        if(response.data.list.length == 0) {
                            uni.showToast({
                                title: '未找到待提货订单',
                                icon: 'none',
                                duration: 1000
                            });
                        }
                        let list = response.data.list;
                        that.more_list = false;
                        if (list.length == response.data.pagination.pageSize) {
                            that.more_list = true;
                            that.page++;
                        }
                        if(that.page == 1) {
                            that.list = list;
                        }else {
                            that.list = that.list.concat(list);
                        }
                        that.$forceUpdate();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.loading = false;
                    that.$hideLoading();
                    uni.hideLoading();
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .search {
        .input {
            height: 100rpx;
            background-color: #fff;
            padding: 0 24rpx;
            margin-bottom: 40rpx;
            width: 100%;
            input {
                height: 100rpx;
                line-height: 100rpx;
            }
        }
    }
</style>