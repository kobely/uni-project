f<template>
    <app-layout>
        <app-tab-nav :tabList="tabList" :activeItem="activeTab" @click="tabStatus" :theme="getTheme"></app-tab-nav>
        <view class="card-list">
            <view @click="toDetail(item)" v-for="item in list" :key="item.id">
                <view class="card-item dir-left-nowrap main-center cross-center">
                    <image class="card-img" :src="item.pic_url"></image>
                    <view class="name dir-top-nowrap" style="height: 100%;" v-if="item.receive_id !== 0">
                        <view class="box-grow-1 dir-left-nowrap cross-bottom">
                            <view class="t-omit-two">{{item.name}}</view>
                        </view>
                        <view class="box-grow-0">
                            <view class="is_send">已转赠</view>
                        </view>
                    </view>
                    <view class="name t-omit-two" v-else>{{item.name}}</view>
                    <view class="right-box dir-top-nowrap main-center cross-center">
                        <image v-if="item.is_may_use === 1"
                               class="card-qr"
                               @click.stop="showModal(item.id)"
                               src="./../image/icon-card-qrcode.png"
                        ></image>
                        <span>{{activeTab == 3 ? '未核销' : '剩余'}}{{item.surplus_number}}次</span>
                    </view>
                </view>
            </view>
        </view>
        <view class="no-list" v-if="list.length === 0">
            <app-no-goods background="#f7f7f7" :title="title"></app-no-goods>
        </view>
        <view class="qr-modal" @click="show=false" v-if="show">
            <view class="look-qr" @click.stop="showModal(0)">
                <view>卡券二维码</view>
                <view>
                    <image :src="img"></image>
                </view>
                <view style="height: 60rpx">
                    <view @click="saveImg">
                        <button>保存图片</button>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import appTabNav from "../../../components/basic-component/app-tab-nav/app-tab-nav.vue";
    import appNoGoods from '../../../components/page-component/app-no-goods/app-no-goods.vue';

    import {mapGetters, mapState} from "vuex";

    export default {
        data() {
            return {
                tabList: [
                    {id:1, name: '未使用'},
                    {id:2, name: '已使用'},
                    {id:3, name: '已过期'}
                ],
                show: false,
                img: '/images/share/img-share-order.png',
                activeTab: 1,
                list: [],
                more: false,
                page: 2,
                title: '暂无未使用卡券~'
            }
        },
        components: {
            'app-tab-nav': appTabNav,
            'app-no-goods': appNoGoods,
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            })
        },
        methods: {
            saveImg() {
                this.$utils.batchSave(this.img).then(res => {
                    uni.showToast({title: '保存成功', icon: 'none'});
                })
            },

            showModal(id) {
                let that = this;
                if(id > 0) {
                    uni.showLoading({
                        text: '生成中...'
                    });
                    that.$request({
                        url: that.$api.card.qrcode,
                        data: {
                            cardId: id,
                        },
                        method: 'get'
                    }).then(response => {
                        uni.hideLoading();
                        if (response.code === 0) {
                            that.show = true;
                            that.img = response.data.file_path;
                        } else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000,
                            });
                        }
                    }).catch(response => {
                        uni.hideLoading();
                        uni.showToast({
                            title: response,
                            icon: 'none',
                            duration: 1000,
                        });
                    });
                }
            },

            tabStatus(e) {
                this.list = [];
                let id = e.currentTarget.dataset.id;
                if (id === 1) {
                    this.title = `暂无未使用优惠券~`;
                } else if (id === 2) {
                    this.title = `暂无已使用优惠券~`;
                } else if (id === 3) {
                    this.title = `暂无已过期优惠券~`;
                }
                this.page = 2;
                this.activeTab = id;
                this.getList();
            },
            getList() {
                let that = this;
                that.$showLoading({
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.card.index,
                    data: {
                        status: that.activeTab
                    },
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code === 0) {
                        that.list = response.data.list;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                        that.getList();
                    });
                });
            },
            getMore() {
                let that = this;
                uni.showLoading({
                    title: '加载中...',
                });
                that.$request({
                    url: that.$api.card.index,
                    data: {
                        page: that.page,
                        status: that.activeTab
                    },
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code === 0) {
                        if(response.data.list.length > 0) {
                            that.loading = null;
                            that.list = that.list.concat(response.data.list);
                            that.page++;
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000,
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            toDetail(card) {
                if (card.is_allow_send == 1) {
                    uni.navigateTo({
                        url: `/pages/card/details/details?id=${card.id}`
                    });
                } else {
                    uni.navigateTo({
                        url: `/pages/card/details/details-no-share?id=${card.id}`
                    });
                }
            },
        },
        onLoad() { this.$commonLoad.onload();
            this.getList();
        },
        onReachBottom() {
            this.getMore();
        }
    }
</script>

<style scoped lang="scss">
    .no-list {
        margin-top: #{150upx};
    }
    .card-list {
        width: 100%;
        padding-top: #{10rpx};
        background-color: #f7f7f7;
    }

    .card-item {
        height: #{180rpx};
        margin: #{20rpx};
        background-color: #fff;
        color: #353535;
        font-size: #{30rpx};
        border-radius: 16#{rpx};

        .name {
            width: 402#{rpx};
            margin-left:35#{rpx};

            .is_send {
                width: #{80rpx};
                height: #{40rpx};
                color: #ff4544;
                font-size: #{20rpx};
                background-color: #ffecec;
                text-align: center;
                line-height: #{40rpx};
                margin: #{16rpx 0 20rpx 0};
            }
        }

        .card-img {
            height: #{88rpx};
            width: #{88rpx};
            border-radius: 50%;
            margin-left:24#{rpx};
        }

        .right-box {
            margin: #{65rpx} #{35rpx};

            .card-qr {
                height: #{50rpx};
                width: #{50rpx};
            }

            span {
                font-size:20#{rpx};
                color: #353535;
                margin-top:10#{rpx};
            }
        }
    }

    .qr-modal {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
        height: 100%;
        width: 100%;
        z-index: 2;
    }

    .look-qr {
        position: absolute;
        background-color: #fff;
        width: #{550rpx};
        height: #{700rpx};
        left: 50%;
        margin-left: #{-275rpx};
        top: 20%;
        border-radius: #{10rpx};
        text-align: center;
        padding: #{50rpx};
        font-size: #{34rpx};
        color: #353535;
    }

    .look-qr image {
        margin-top: #{25rpx};
        height: #{450rpx};
        width: #{450rpx};
    }

    .look-qr button {
        margin: #{15rpx} auto 0;
        height: #{60rpx};
        line-height: #{60rpx};
        color: #fff;
        font-size: #{28rpx};
        width: #{200rpx};
        background-color: #ff4544;
    }
</style>
