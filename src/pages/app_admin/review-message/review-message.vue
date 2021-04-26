<template>
    <app-layout>
        <scroll-view @scrolltolower="getMore" scroll-y :style="{'height':`${windowHeight}px`}">
            <view class="review-message">
                <view v-if="titleShow" class="bar">
                    <scroll-view class="scroll-view" scroll-x="true">
                        <view class="bar-item" :style="{'width': `${titleWidth}`}" v-for="item in tab" :key="item.key" @click="tabSwitch(item.key)">
                            <app-form-id>
                                <view :class="['bar-item-text',`${type === item.key ? 'text-active' : ''}`]">{{item.name}}
                                    <view class="bar-item-tips">{{item.plugin}}</view>
                                </view>
                            </app-form-id>
                        </view>
                    </scroll-view>
                </view>
                <view class="search" :class="{'search-top': titleShow}">
                    <view class="search-view dir-left-nowrap main-center cross-center" v-if="!searchBool" @click="searchBool = true;getFocus=true">
                        <image class="image" src="../image/icon-search.png"></image>
                        <view class="text">{{type === 'mch' ? '请输入店铺名称搜索': type =='share' ? '请输入昵称或姓名搜索' : type =='community' ? '请输入姓名搜索' : '请输入昵称搜索' }}</view>
                    </view>
                    <view v-else style="position: relative">
                        <input id="search" confirm-type="search" :placeholder="type === 'mch' ? '请输入店铺名称搜索': type =='share' ? '请输入昵称或姓名搜索' : type =='community' ? '请输入姓名搜索' : '请输入昵称搜索'" v-model="keyword" type="text" focus v-if="searchBool" @focus="getFocus=true" @blur="blurFocus" class="search-view" :focus="getFocus" @confirm="getFocus=false">
                        <image v-if="keyword.length > 0" @click="clearSearch" class="search-clear" src="../image/clear.png"></image>
                    </view>
                </view>
                <view class="content" :class="{'content-top': titleShow}">
                    <view @click="toUrl(item)" class="dir-top-nowrap" :key="index" v-for="(item, index) in list" :class="type == 'share' || type == 'stock' || type == 'bonus' ? 'content-item' :'check-content'">
                        <view class="dir-left-nowrap" :class="type == 'share' || type == 'stock' || type == 'bonus' ? 'content-content' :'check-nei cross-center'">
                            <image :src="item.avatar" :class="type == 'share' || type == 'stock' || type == 'bonus' ? 'content-image' :'check-avatar'"></image>
                            <view class="dir-top-nowrap" :class="type == 'share' || type == 'stock' || type == 'bonus' ? 'content-name' :'check-content-content'">
                                <view class="name">{{item.nickname}}</view>
                                <view v-if="type === 'share'" class="referrer">姓名：{{item.name}}</view>
                                <view v-if="type === 'share'" class="referrer">手机号：{{item.mobile}}</view>
                                <view v-if="type === 'mch' || type === 'share'" :class="type == 'share'? 'referrer' :'shop'">{{item.tip}}</view>
                                <view v-if="type === 'region'" class="shop">代理级别：{{item.tip}}</view>
                            </view>
                            <image v-if="type != 'share' && type != 'stock' && type != 'bonus'" class="icon" src="../image/arrow-right.png"></image>
                        </view>
                        <view v-if="type == 'share' || type == 'stock' || type == 'bonus'" class="content-buttons dir-left-nowrap main-right">
                            <view v-if="type == 'share' && item.form" class="refuse" @click="toggle(item)">
                                <app-form-id>
                                    表单信息
                                </app-form-id>
                            </view>
                            <view class="refuse" @click="refuse(item)">
                                <app-form-id>
                                    拒绝
                                </app-form-id>
                            </view>
                            <view class="by" @click="by(item)">
                                <app-form-id>
                                    通过
                                </app-form-id>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="no-tip" v-if="list.length === 0">
                    <image src="https://v4test.zjhejiang.com/web/statics/img/app/app_admin/no-message.png"></image>
                    <view>没有任何消息哦~</view>
                </view>
                <view @touchmove.stop.prevent="" class="model" v-if="model">
                    <template v-if="modelType === 1">
                        <view class="refuse">
                            <view class="top">{{type != 'share' && type != 'mch' ? '拒绝申请' : '不通过申请'}}</view>
                            <view class="content">
                                <textarea v-model="reasonRefusal" class="textarea" placeholder="请填写拒绝理由"></textarea>
                            </view>
                            <view class="buttons dir-left-nowrap cross-center">
                                <view class="but cancel"  @click="cancel">
                                    <app-form-id>
                                        取消
                                    </app-form-id>
                                </view>
                                <view class="line"></view>
                                <view class="but confirm"  @click="confirm">
                                    <app-form-id>确认</app-form-id>
                                </view>
                            </view>
                        </view>
                    </template>
                    <template v-if="modelType === 2">
                        <view class="by">
                            <view class="top">通过申请</view>
                            <view class="content">
                                是否确认通过申请
                            </view>
                            <view class="buttons dir-left-nowrap cross-center">
                                <view class="but cancel" @click="cancel">
                                    <app-form-id>
                                        取消
                                    </app-form-id>
                                </view>
                                <view class="line"></view>
                                <view class="but confirm" @click="confirm">
                                    <app-form-id>确认</app-form-id>
                                </view>
                            </view>
                        </view>
                    </template>
                </view>
                <view class="model" v-if="showForm">
                    <view class="form">
                        <view class="top">表单信息</view>
                        <view class="form-content">
                            <view v-for="(item,index) in form" v-if="item.value" :key="index" class="price-item">
                                <view class="price-label">{{item.label}}</view>
                                <view v-if="item.key == 'img_upload'">
                                    <view v-if="Array.isArray(item.value)">
                                        <block v-for="(img,key) in item.value" :key="key">
                                            <image v-if="img" v-show="!item.loadOver" @load="imageLoad(index)" @click='look(img)' class="form-img" :src='img'></image>
                                        </block>
                                    </view>
                                    <view v-else>
                                        <image v-if="item.value" v-show="!item.loadOver" @load="imageLoad(index)" @click='look(item.value)' class="form-img" :src='item.value'></image>
                                    </view>
                                </view>
                                <view style="word-break: break-all" v-else>{{item.value}}</view>
                            </view>
                        </view>
                        <view class="buttons dir-left-nowrap cross-center">
                            <view class="but cancel" @click="cancel">
                                <app-form-id>
                                    取消
                                </app-form-id>
                            </view>
                            <view class="line"></view>
                            <view class="but confirm" @click="cancel">
                                <app-form-id>确认</app-form-id>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";
    export default {
        name: "review-message",
        data() {
            return {
                type: 'share',
                first: true,
                over: false,
                titleShow: false,
                showForm: false,
                form: [],
                list: [],
                tab: [],
                getFocus: false,
                keyword: '',
                searchBool: false,
                modelType: 1,
                reasonRefusal: '',
                setItem: {},
                titleWidth: '100%',
                model: false,
                page: 1
            }
        },
        computed: {
            ...mapState({
                windowHeight : state=>state.gConfig.systemInfo.windowHeight
            })
        },
        onLoad() { this.$commonLoad.onload();
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.getTabs();
        },
        onShow() {
            if(this.first) {
                return false
            }
            this.request({
                key: this.type,
                page: 1,
                keyword: this.keyword,
            }).then(response => {
                if (response) {
                    this.list = response.list;
                }
            });
        },
        methods: {
            getMore() {
                if (!this.over) {
                    this.page++;
                    this.request({
                        key: this.type,
                        page: this.page,
                        keyword: this.keyword,
                    }).then(response => {
                        if (response && response.list.length > 0) {
                            this.list = [...this.list, ...response.list];
                        } else if (response && response.list.length === 0) {
                            this.over = true;
                        }
                    });
                }
            },
            imageLoad(index) {
                this.form[index].loadOver = false;
            },
            // 查看图片
            look(e) {
                uni.previewImage({
                    current: e, // 当前显示图片的http链接
                    urls: [e] // 需要预览的图片http链接列表
                })
            },
            toggle(item) {
                this.form = item.form;
                for(let i in this.form) {
                    if(this.form[i].key == 'img_upload' &&  Array.isArray(this.form[i].value)) {
                        let show = false;
                        for(let img of this.form[i].value) {
                            if(img != '') {
                                show = true;
                            }
                        }
                        if(!show) {
                            this.form.splice(i,1)
                        }
                    }
                }
                this.showForm = true;
            },
            toUrl(item) {
                if(this.type == 'region' || this.type == 'community' || this.type == 'mch') {
                    let url = '/pages/app_admin/'+this.type+'-detail/'+this.type+'-detail?id=';
                    if(this.type == 'region') {
                        url += item.id + '&name=' + item.nickname
                    }
                    if(this.type == 'mch') {
                        url += item.id
                    }
                    if(this.type == 'community') {
                        url += item.user_id
                    }
                    uni.navigateTo({
                        url: url
                    });
                }
            },
            tabSwitch(type) {
                this.list = [];
                this.type = type;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.request({
                    key: type,
                    page: 1,
                    keyword: '',
                }).then(response => {
                    uni.hideLoading();
                    if (response) {
                        this.list = response.list;
                    }
                });
            },
            getTabs() {
                let that = this;
                that.$request({
                    url: that.$api.app_admin.tabs_v2,
                    method: 'get'
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.tab = response.data;
                        if(that.tab.length == 1) {
                            uni.setNavigationBarTitle({
                                title: that.tab[0].plugin + '审核消息'
                            })
                        }else {
                            that.titleShow = true;
                        }
                        that.titleWidth = 1/that.tab.length * 100 + '%';
                        that.type = response.data[0].key;
                        that.request({
                            key: response.data[0].key,
                            page: 1,
                            keyword: '',
                        }).then(response => {
                            this.first = false;
                            if (response) {
                                that.list = response.list;
                            }
                        })
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                })
            },
            blurFocus() {
                let that = this;
                setTimeout(v =>{
                    that.getFocus=false;
                    that.searchText();
                },300);
            },

            clearSearch() {
                this.keyword = '';
                this.searchBool = false;
                if(!this.searchBool) {
                    this.searchText();
                }
            },

            changeType(data) {
                this.list = [];
                this.page = 1;
                this.type = data;
                this.over = false;
                this.keyword = '';
                this.searchBool = false;
                this.request({
                    key: data,
                    page: this.page,
                    keyword: this.keyword,
                }).then(response => {
                    if (response) {
                        this.list = response.list;
                    }
                });
            },
            async request({key, page, keyword}) {
                const response = await this.$request({
                    url: this.$api.app_admin.review_v2,
                    data: {
                        key: key,
                        page: page,
                        keyword: keyword
                    }
                });
                if (response.code === 0) {
                    return response.data;
                } else {
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000
                    });
                    return false;
                }
            },
            checkQueue(queue_id) {
                this.$request({
                    url: this.$api.app_admin.queue,
                    data: {
                        queue_id: queue_id,
                    }
                }).then(response => {
                    if (response.retry && response.retry == 1) {
                        this.checkQueue(queue_id);
                    }else {
                        for (let i = 0; i < this.list.length; i++) {
                            if (this.list[i].id === this.setItem.id) {
                                this.$delete(this.list, i);
                                this.model=false;
                                this.setItem = {};
                            }
                        }
                    }
                })
            },
            searchText() {
                if (this.keyword === '') {
                    this.searchBool = false;
                }
                this.page = 1;
                this.over = false;
                uni.showLoading({
                    mask: true,
                    title: '搜索中...'
                });
                this.request({
                    key: this.type,
                    page: this.page,
                    keyword: this.keyword,
                }).then(response => {
                    uni.hideLoading();
                    if (response) {
                        this.list = response.list;
                    }
                });
            },
            refuse(data) {
                this.setItem = data;
                this.modelType = 1;
                this.model = true;
            },
            by(data) {
                this.setItem = data;
                this.modelType = 2;
                this.model = true;
            },
            confirm() {
                if (this.modelType === 2) {
                    this.$request({
                        url: this.$api.app_admin.review_switch_v2,
                        method: 'post',
                        data: {
                            key: this.type,
                            status: 1,
                            form: JSON.stringify(this.setItem),
                            user_id: this.setItem.user_id
                        }
                    }).then(response => {
                        if (response.code === 0) {
                            if(this.type == 3) {
                                this.checkQueue(response.data.queue_id);
                            }else {
                                for (let i = 0; i < this.list.length; i++) {
                                    if (this.list[i].id === this.setItem.id) {
                                        this.$delete(this.list, i);
                                        this.model=false;
                                        this.setItem = {};
                                    }
                                }
                            }
                        }
                    })
                } else if (this.modelType === 1) {
                    this.setItem.review_remark = this.reasonRefusal;
                    this.$request({
                        url: this.$api.app_admin.review_switch_v2,
                        method: 'post',
                        data: {
                            key: this.type,
                            status: 2,
                            form: JSON.stringify(this.setItem),
                            reason: this.reasonRefusal,
                            user_id: this.setItem.user_id
                        }
                    }).then(response => {
                        if (response.code === 0) {
                            this.reasonRefusal = '';
                            for (let i = 0; i < this.list.length; i++) {
                                if (this.list[i].id === this.setItem.id) {
                                    this.$delete(this.list, i);
                                    this.model=false;
                                    this.setItem = {};
                                }
                            }
                        }else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    });
                }
            },
            cancel() {
                this.model=false;
                this.form = [];
                this.showForm = false;
                this.setItem = {};
            }
        }
    }
</script>

<style scoped lang="scss">
@import "./review-message.scss";
</style>