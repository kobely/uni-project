<template>
    <app-layout>
        <app-index v-if="detail.status == 1 && !up" :setting="setting" :detail="detail"></app-index>
        <view class="other" v-else :style="{'background-color':`${beApply && !wait ? '#f7f7f7': '#fff'}`}">
            <!-- 头部图片 -->
            <view class="header">
                <image v-if="status" :src="setting.form.bg_url == 'statics/img/app/region/banner.png' ? region.banner : setting.form.bg_url"></image>
            </view>
            <view class="choose-level" v-if="applyArea">
                <view>
                    <view>选择代理级别</view>
                    <view @click="choose(1)" class="main-between cross-center choose-level-item">
                        <view :style="{'color':`${choose_level.id > 0 ? '#353535': '#999'}`}">{{choose_level.name}}</view>
                        <image v-if="!up" class="more" src="/static/image/icon/icon-down.png"></image>
                    </view>
                </view>
                <view>
                    <view>选择省</view>
                    <view @click="choose(2)" class="main-between cross-center choose-level-item">
                        <view :style="{'color':`${choose_province.id > 0 ? '#353535': '#999'}`}">{{choose_province.name}}</view>
                        <image v-if="!up" class="more" src="/static/image/icon/icon-down.png"></image>
                    </view>
                </view>
                <view v-if="choose_level.id > 1">
                    <view>选择市</view>
                    <view @click="choose(3)" class="main-between cross-center choose-level-item">
                        <view class="dir-left-wrap district-list" v-if="choose_district.length > 0 && choose_level.id == 2">
                            <view style="color: #353535" v-for="(item,index) in choose_district" :key="item.name">
                                <text v-if="index > 0">/</text>
                                {{item.name}}
                            </view>
                        </view>
                        <view v-else-if="choose_district.length == 0 && choose_level.id == 2">请选择市</view>
                        <view v-else :style="{'color':`${choose_city.id > 0 ? '#353535': '#999'}`}">{{choose_city.name}}</view>
                        <image class="more" src="/static/image/icon/icon-down.png"></image>
                    </view>
                </view>
                <view v-if="choose_level.id > 2">
                    <view>选择区/县</view>
                    <view @click="choose(4)" class="main-between cross-center choose-level-item">
                        <view class="dir-left-wrap district-list" v-if="choose_district.length > 0">
                            <view style="color: #353535" v-for="(item,index) in choose_district" :key="item.name">
                                <text v-if="index > 0">/</text>
                                {{item.name}}
                            </view>
                        </view>
                        <view v-else>请选择区/县</view>
                        <image class="more" src="/static/image/icon/icon-down.png"></image>
                    </view>
                </view>
            </view>
            <view class="submit-area">
                <view @click="getDetail" style="margin-bottom: 0" v-if="applyArea && !up" class="apply-sumbit be-apply">
                    <button>申请代理</button>
                </view>
                <view @click="submitUpdate" style="margin-bottom: 0" v-if="applyArea && up" class="apply-sumbit be-apply">
                    <button>立即升级</button>
                </view>
            </view>
            <!-- 未达成条件 -->
            <app-condition :province="choose_province" :city="choose_city" :district="choose_district" @toRead="toRead" @beRead="beRead" @submit="submit" v-if="look" v-on:update="receive" v-on:reset="resetChoose" :read="read" :setting="setting" :rate="rate" :check="check"></app-condition>
            <!-- 等待审核 -->
            <view v-if="wait" class="wait">
                <image :src="bonusImg.wait"></image>
                <view v-if="up" class="up">
                    <text>您正在申请升级为
                        <text :style="{'color': `${choose_level.id > 1 ? '#666666' : '#ff8f17'}`}">{{detail.province_text}}</text>
                    </text>
                    <text style="color: #ff8f17" v-if="detail.level_up.level_desc == '市代理'" v-for="(item,index) in choose_district" :key="item.id">
                        <text v-if="index > 0">、</text>
                        {{item.name}}
                    </text>
                    <text>的{{detail.level_up.level_desc}},请耐心等待审核...</text>
                </view>
                <view v-else>代理申请已提交，请耐心等待审核...</view>
                <view class="submit-area">
                    <view @click="toIndex" class="apply-sumbit to-mall">
                        <button>去商城逛逛</button>
                    </view>
                </view>
            </view>
            <!-- 申请页面 -->
            <view class="apply-area" v-if="beApply && !wait">
                <view class="apply">
                    <view class="apply-input" style="border-top:0">欢迎申请区域代理，请填写申请信息</view>
                    <view class="apply-input dir-left-nowrap">
                        <view class="label">姓名</view>
                        <input v-model="name" placeholder="请填写真实姓名" placeholder-style="color:#cdcdcd"></input>
                    </view>
                    <view class="apply-input dir-left-nowrap">
                        <view class="label">手机号</view>
                        <input v-model="mobile" type="number" placeholder="请填写手机号" placeholder-style="color:#cdcdcd"></input>
                    </view>
                    <view class="apply-input cross-center" v-if="setting.is_agreement == 1">
                        <view class="read" @click="beRead">
                            <image src="/static/image/icon/icon-uncheck.png" v-if="read == false"></image>
                            <image src="/static/image/icon/icon-checkbox-checked-a.png" v-else></image>
                        </view>
                        <text>已阅读并同意《</text>
                        <text class="agreement_title" @click="toRead">{{setting.agreement_title ? setting.agreement_title : '区域代理申请协议'}}</text>
                        <text>》</text>
                    </view>
                </view>
                <view @click="submit" class="apply-sumbit be-apply">
                    <button>{{setting.form.apply_text ? setting.form.apply_text : '申请成为区域代理'}}</button>
                </view>
            </view>
            <view v-if="refuse || remove" class="refuse">
                <image src="./../image/refuse.png"></image>
                <view v-if="refuse">您的申请被拒</view>
                <view v-if="remove">您被解除代理身份</view>
                <view class="refuse-info">
                    <view>审核时间:
                        <text v-if="detail.level_up_log && detail.level_up_log.status == 2">{{detail.level_up_log.updated_at}}</text>
                        <text v-else>{{detail.agreed_at}}</text>
                    </view>
                    <view class="refuse-reason" v-if="refuse">拒绝理由:
                        <text v-if="detail.level_up_log.status == 2" style="word-wrap:break-word;">{{detail.level_up_log.reason ? detail.level_up_log.reason :"无"}}</text>
                        <text v-else style="word-wrap:break-word;">{{detail.reason ? detail.reason :"无"}}</text>
                    </view>
                    <view class="refuse-reason" v-if="remove">解除理由:
                        <text style="word-wrap:break-word;">{{detail.reason ? detail.reason :"无"}}</text>
                    </view>
                    <view class="submit-area">
                        <view @click="reApply" class="apply-sumbit to-mall">
                            <button>再次申请</button>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 底部图片 -->
            <image v-if="beApply && !wait" :style="{'height':`${height}px`}" @load="imageLoad" class="rights" :src="setting.form.bottom_bg_url == 'statics/img/app/region/foot.png' ? region.foot : setting.form.bottom_bg_url"></image>
        </view>
        <!-- 分红协议（modal模式） -->
        <view class="modal cross-center main-center" v-if="protocol">
            <view class="protocol">
                <view class="protocol-name t-omit">{{setting.agreement_title}}</view>
                <view class="protocol-content">
                    <app-rich-text :content="protocol"></app-rich-text>
                </view>
                <view @click="protocol=null;read=true">
                    <view class="read-over">我已阅读</view>
                </view>
            </view>
        </view>
        <view class="modal" @click="close" v-show="show_dialog || show_list">
            <view :class="['select-dialog', `${iphone_x?'iphone_x':''}`]" @click.stop="">
                <view class="select-title">
                    <view>{{dialog_title}}</view>
                    <view @click.stop="confirm" class="submit-btn">确定</view>
                </view>
                <picker-view v-show="show_dialog" :style="{ 'height': `${dialog_title == '选择代理级别' ? '360' : '536'}rpx`}" indicator-style="height: 44px;" @change="bindChange" :value="chooseIndex">
                    <picker-view-column>
                        <view
                            v-for="(item,idx) in choose_list" :key="item.name"
                            :class="[`picker-view`,{
                                'sure-color': newIndex == idx
                            }]">
                            {{item.name}}
                        </view>
                    </picker-view-column>
                </picker-view>
                <view class="dialog-list dir-left-wrap" v-if="show_list">
                    <view @click.stop="chooseDistrict(item,idx)" :class="[`dialog-item`,{'active': item.show}]" v-for="(item,idx) in choose_list" :key="item.name">{{item.name}}</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";
    import appIndex from '../components/app-index/app-index';
    import appCondition from '../components/app-condition/app-condition';
    import appRichText from "../../../components/basic-component/app-rich/parse.vue";

    export default {
        data() {
            return {
                up: false,
                iphone_x: false,
                detail: {
                    bonus_rate: 0
                },
                protocol: null,
                setting: {},
                name: '',
                mobile: '',
                applyArea: false,
                wait: false,
                refuse: false,
                remove: false,
                read: false,
                look: false,
                beApply: false,
                rate: 0,
                template_message: [],
                height: 0,
                status: false,
                province: [],
                city: [],
                district: [],
                level_list: [
                    {id: '1',name:'省代理'},
                    {id: '2',name:'市代理'},
                    {id: '3',name:'区/县代理'}
                ],
                choose_list: [],
                choose_level: {
                    id: 0,
                    name: '请选择代理级别'
                },
                choose_province: {
                    id: 0,
                    name: '请选择省'
                },
                choose_city: {
                    id: 0,
                    name: '请选择市'
                },
                choose_district: [],
                show_dialog: false,
                show_list: false,
                dialog_title: '',
                newIndex: 0,
                chooseIndex: [0],
                first: true,
                check: {}
            }
        },
        components: {
            'app-index': appIndex,
            "app-rich-text": appRichText,
            'app-condition': appCondition,
        },
        computed: {
            ...mapState({
                region: state => state.mallConfig.__wxapp_img.region,
                bonusImg: state => state.mallConfig.__wxapp_img.bonus
            })
        },
        methods: {
            resetChoose() {
                this.look = false;
                this.choose_level = {
                    id: 0,
                    name: '请选择代理级别'
                }
                this.choose_province = {
                    id: 0,
                    name: '请选择省'
                }
                this.choose_city = {
                    id: 0,
                    name: '请选择市'
                }
                this.choose_district = []
                this.applyArea = true;
            },
            chooseDistrict(item,index) {
                this.choose_list[index].show = !this.choose_list[index].show;
                this.$forceUpdate();
            },
            close() {
                this.show_list = false;
                this.show_dialog = false;
                this.chooseIndex = [0];
                this.newIndex = 0;
                this.choose_list = [];
            },
            choose(index) {
                this.show_list = false;
                this.show_dialog = false;
                this.chooseIndex = [0];
                this.newIndex = 0;
                if(index == 1 && !this.up) {
                    this.dialog_title = '选择代理级别';
                    this.choose_list = this.level_list;
                    for(let i in this.level_list) {
                        if(this.level_list[i].id == this.choose_level.id) {
                            this.chooseIndex[0] = +i;
                            this.newIndex = +i;
                        }
                    }
                    this.show_dialog = true;
                }else if(index == 2 && !this.up) {
                    this.dialog_title = '选择省';
                    this.choose_list = this.province;
                    for(let i in this.province) {
                        if(this.province[i].id == this.choose_province.id) {
                            this.chooseIndex[0] = +i;
                            this.newIndex = +i;
                        }
                    }
                    this.show_dialog = true;
                }else if(index == 3) {
                    this.dialog_title = '选择市';
                    this.choose_list = this.city;
                    if(this.choose_level.id == 2) {
                        for(let i in this.choose_list) {
                            this.choose_list[i].show = false;
                            for(let j in this.choose_district) {
                                if(this.choose_list[i].id == this.choose_district[j].id) {
                                    this.choose_list[i].show = true;
                                }
                            }
                        }
                        this.show_list = true;
                    }else {
                        for(let i in this.city) {
                            if(this.city[i].id == this.choose_city.id) {
                                this.chooseIndex[0] = +i;
                                this.newIndex = +i;
                            }
                        }
                        this.show_dialog = true;
                    }
                }else if(index == 4 && !this.up) {
                    this.dialog_title = '选择区/县';
                    this.choose_list = this.district;
                    for(let i in this.choose_list) {
                        this.choose_list[i].show = false;
                        for(let j in this.choose_district)
                        if(this.choose_list[i].id == this.choose_district[j].id) {
                            this.choose_list[i].show = true;
                        }
                    }
                    this.show_list = true;
                }
            },
            confirm() {
                if(this.dialog_title == '选择代理级别') {
                    this.choose_level = this.choose_list[this.newIndex];
                    if(this.newIndex != this.chooseIndex[0]) {
                        if(this.choose_level.id == 3) {
                            this.choose_city = {
                                id: 0,
                                name: '请选择市'
                            }
                            this.choose_district = [];
                        }else if(this.choose_level.id == 2) {
                            this.choose_city = []
                        }
                    }else {
                        this.chooseIndex[0] = this.newIndex;
                    }
                }else if(this.dialog_title == '选择省') {
                    this.choose_province = this.choose_list[this.newIndex];
                    this.city = this.choose_list[this.newIndex].list;
                    if(this.newIndex != this.chooseIndex[0]) {
                        if(this.choose_level.id == 3) {
                            this.choose_city = {
                                id: 0,
                                name: '请选择市'
                            }
                            this.choose_district = [];
                        }else if(this.choose_level.id == 2) {
                            this.choose_city = [];
                            this.choose_district = [];
                        }
                    }else {
                        this.chooseIndex[0] = this.newIndex;
                    }
                }else if(this.dialog_title == '选择市') {
                    this.choose_city = this.choose_list[this.newIndex];
                    this.district = this.choose_list[this.newIndex].list;
                    if(this.newIndex != this.chooseIndex[0]) {
                        this.choose_district = []
                    }else {
                        this.chooseIndex[0] = this.newIndex;
                    }
                }
                if(this.show_list) {
                    this.choose_district = [];
                    for(let i in this.choose_list) {
                        if(this.choose_list[i].show) {
                            this.choose_district.push(this.choose_list[i])
                        }
                    }
                }
                this.show_dialog = false;
                this.show_list = false;
            },
            bindChange(e) {
                this.newIndex = +e.detail.value[0];
            },
            toRead() {
                this.protocol = this.setting.agreement_content;
            },
            reApply() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.wait = false;
                that.$request({
                    url: that.detail && that.detail.level_up_log && that.detail.level_up_log.status == 2 ? that.$api.region.clear_up : that.$api.region.clear,
                    method: 'post'
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.refuse = false;
                        that.remove = false;
                        that.applyArea = true;
                        if(that.detail.level_up_log.status == 2) {
                            that.choose_province = {
                                id: that.detail.province_id,
                                name: that.detail.province_text
                            }
                            if(that.detail.level_up.level == 2) {
                                for(let i in that.province) {
                                    if(that.province[i].id == that.detail.province_id) {
                                        that.city = that.province[i].list
                                    }
                                }
                            }
                        }else {
                            uni.setNavigationBarTitle({
                                title: that.setting.form.apply_title_text ? that.setting.form.apply_title_text: '申请成为代理',
                            })
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
            },
            receive(e) {
                this.beApply = true;
            },
            beRead() {
                this.read = !this.read;
            },
            toIndex() {
                uni.navigateTo({
                    url: '/pages/index/index'
                }); 
            },
            imageLoad: function (e) {
                var $width = e.detail.width; //获取图片真实宽度
                var $height = e.detail.height; //获取图片真实高度
                this.height = $height * (750 / $width) / 2
            },
            submit() {
                let that = this;
                let is_agree = 0;
                if(that.read || that.setting.is_agreement == 0) {
                    is_agree = 1;   
                }else {
                    uni.showToast({
                        title: that.setting.agreement_title ? '请先查看' + that.setting.agreement_title +'申请协议并同意' : '请先查看区域代理申请协议并同意',
                        icon: 'none',
                        duration: 1000
                    });
                    return false;
                }
                if(that.setting.apply_type < 2) {
                    if( that.name && that.mobile) {
                        if(that.mobile.length == 11 && (/0?(1)[0-9]{10}/.test(that.mobile))) {
                            this.$subscribe(this.template_message).then(res => {
                                this.submitApply(is_agree);
                            }).catch(res => {
                                this.submitApply(is_agree);
                            });
                        }else {
                            uni.showToast({
                                title: '请输入正确的手机号码',
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    }else {
                        uni.showToast({
                            title: '请完善申请信息',
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }else {
                    this.$subscribe(this.template_message).then(res => {
                        this.submitApply(is_agree);
                    }).catch(res => {
                        this.submitApply(is_agree);
                    });
                }
            },
            submitApply(is_agree) {
                let that = this;
                let city_id = [];
                let district_id = [];
                if(that.choose_level.id == 3) {
                    city_id.push(that.choose_city.id)
                    for(let i in that.choose_district) {
                        district_id.push(that.choose_district[i].id)
                    }
                }
                if(that.choose_level.id == 2) {
                    for(let i in that.choose_district) {
                        city_id.push(that.choose_district[i].id.toString())
                    }
                }
                that.$request({
                    url: that.$api.region.apply,
                    data: {
                        name: that.name,
                        mobile: that.mobile,
                        province_id: that.choose_province.id,
                        level: that.choose_level.id,
                        city_id: JSON.stringify(city_id),
                        district_id: JSON.stringify(district_id),
                        is_agree: is_agree
                    },
                    method: 'post'
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        uni.showToast({
                            title: response.msg,
                            duration: 1000
                        });
                        that.name = '';
                        that.mobile = '';
                        setTimeout(function() {
                            uni.showLoading({
                                mask: true,
                                title: '加载中...'
                            });
                            that.getStatus();
                            that.look = false;
                            if(that.setting.apply_type == 1 || that.setting.apply_type == 3) {
                                that.wait = true;
                            }
                        }, 500)
                    }else {
                        if (response.msg == '请先查看区域代理申请协议并同意') {
                            response.msg = '请先查看' + that.setting.agreement_title +'申请协议并同意'
                        }
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
            submitUpdate() {
                let that = this;
                if(that.choose_level.id == 2 && that.choose_district.length == 0 ) {
                    uni.showToast({
                        title: '请选择市',
                        icon: 'none',
                        duration: 1000
                    });
                    return false
                }
                uni.showLoading({
                    mask: true,
                    title: '申请中...'
                });
                let city = [];
                if(that.choose_district.length > 0) {
                    for(let i in that.choose_district) {
                        city.push(that.choose_district[i].id)
                    }
                }
                that.$request({
                    url: that.$api.region.level_up,
                    data: {
                        city_id: JSON.stringify(city),
                        level: that.choose_level.id
                    },
                    method: 'post'
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.wait = true;
                        that.applyArea = false;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
            },
            getStatus() {
                let that = this;
                that.wait = false;
                that.status = false;
                that.$request({
                    url: that.$api.region.status,
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    that.first = false;
                    that.status = true;
                    if(response.code == 0) {
                        that.detail = response.data.region;
                        if(that.up) {
                            uni.setNavigationBarTitle({
                                title: '升级区域代理',
                            })
                            that.choose_level = {
                                id: that.detail.level_up.level,
                                name: that.detail.level_up.level_desc
                            }
                            if(that.detail.level_up_log && that.detail.level_up_log.status == 2) {
                                that.$hideLoading();
                                uni.hideLoading();
                                that.beApply = false;
                                that.refuse = true;                                
                            }else {
                                if(that.detail.level_up.relation.length > 0) {
                                    that.wait = true;
                                    that.choose_district = that.detail.level_up.relation
                                }else {
                                    that.applyArea = true;
                                    that.choose_province = {
                                        id: that.detail.province_id,
                                        name: that.detail.province_text
                                    }
                                    if(that.detail.level_up.level == 2) {
                                        for(let i in that.province) {
                                            if(that.province[i].id == that.detail.province_id) {
                                                that.city = that.province[i].list
                                            }
                                        }
                                    }
                                }
                            }
                        }else {
                            if(response.data.region.name) {
                                that.name = response.data.region.name;
                            }
                            if(response.data.region.phone) {
                                that.mobile = response.data.region.phone;
                            }
                            if(that.detail.status == -1) {
                                that.$hideLoading();
                                uni.hideLoading();
                                that.beApply = false;
                                that.remove = true;
                            }else if(that.detail.status == 2) {
                                that.$hideLoading();
                                uni.hideLoading();
                                that.beApply = false;
                                that.refuse = true;
                            }else if(that.detail.status == 1) {
                                that.$hideLoading();
                                uni.hideLoading();
                                that.beApply = false;
                                return false;
                            }else if(that.detail.status == 0) {
                                that.$hideLoading();
                                uni.hideLoading();
                                that.beApply = false;
                                that.wait = true;
                            }else {
                                if(!that.look && !that.beApply) {
                                    uni.setNavigationBarTitle({
                                        title: that.setting.form.apply_title_text ? that.setting.form.apply_title_text: '申请成为代理',
                                    })
                                    that.applyArea = true;
                                }
                            }
                        }

                    }else {
                        if(response.msg == '用户未申请区域代理') {
                            // that.getDetail();
                            if(!that.look && !that.beApply) {
                                uni.setNavigationBarTitle({
                                    title: that.setting.form.apply_title_text ? that.setting.form.apply_title_text: '申请成为代理',
                                })
                                that.applyArea = true;
                            }
                        }else {
                            that.$hideLoading();    
                            uni.hideLoading();
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    }
                }).catch(response => {
                    that.$hideLoading();
                    uni.hideLoading();
                });
            },
            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.region.setting,
                }).then(response=>{
                    if(response.code == 0) {
                        that.getStatus();
                        that.setting = response.data;
                        that.template_message = response.data.template_message_region;
                        uni.setNavigationBarTitle({
                            title: that.setting.form.title?that.setting.form.title: '区域代理',
                        })
                    }else {
                        that.$hideLoading();
                        uni.hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                    uni.hideLoading();
                });
            },
            getPlace() {
                let that = this;
                that.$request({
                    url: that.$api.city.cityName,
                }).then(response=>{
                    if(response.code == 0) {
                        that.getSetting();
                        that.province = response.data.list;
                        for(let i in that.province) {
                            if(that.province[i].name == '其他') {
                                that.province.splice(i,1)
                            }
                        }
                    }else {
                        that.$hideLoading();
                        uni.hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                    uni.hideLoading();
                });
            },
            getDetail() {
                let that = this;
                that.check = {};
                if(that.choose_level.id == 0) {
                    uni.showToast({
                        title: '请选择代理级别',
                        icon: 'none',
                        duration: 1000
                    });
                    return false
                }
                if(that.choose_province.id == 0) {
                    uni.showToast({
                        title: '请选择省',
                        icon: 'none',
                        duration: 1000
                    });
                    return false
                }
                if((that.choose_level.id == 3 && that.choose_city.id == 0 ) || (that.choose_level.id == 2 && that.choose_district.length == 0 )) {
                    uni.showToast({
                        title: '请选择市',
                        icon: 'none',
                        duration: 1000
                    });
                    return false
                }
                if(that.choose_level.id == 3 && that.choose_district.length == 0) {
                    uni.showToast({
                        title: '请选择代理区域',
                        icon: 'none',
                        duration: 1000
                    });
                    return false
                }
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.region.index,
                    data: {
                        province_id: that.choose_province.id,
                        level: that.choose_level.id
                    }
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.look = true;
                        that.applyArea = false;
                        that.refuse = false;
                        that.remove = false;
                        that.check = response.data;
                        that.rate = +that.check.now_target / +that.check.target *100;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
            }
        },
        onShow() {
            let that = this;
            if(!that.first) {
                that.getStatus();
            }
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            if(options.name) {
                that.name = options.name
            }
            if(options.mobile) {
                that.mobile = options.mobile
            }
            if(options.up > 0) {
                this.up = true;
            }
            that.getPlace();
        }
    }
</script>

<style scoped lang="scss">
    .other {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        .rights {
            width: 100%;
        }
        .header {
            height: #{360rpx};
            width: 100%;
            image {
                width: 100%;
                height: 100%;
            }
        }
        .apply-area {
            background-color: #f7f7f7;
            padding: #{20rpx} 0 #{24rpx};
            .apply {
                background-color: #fff;
                padding: 0 #{24rpx};
                margin-bottom: #{24rpx};
                .apply-input {
                    height: #{80rpx};
                    line-height: #{80rpx};
                    border-top: #{1rpx} solid #e2e2e2;
                    font-size: #{28rpx};
                    color: #353535;
                    .agreement_title {
                        color:#ff4544;
                        max-width: #{360rpx};
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    text {
                        display: inline-block;
                    }
                    input {
                        border: 0;
                        width: #{560rpx};
                        height: #{60rpx};
                        line-height: #{60rpx};
                        margin-top: #{10rpx};
                    }
                    .label {
                        width: #{126rpx};
                    }
                    .read {
                        width: #{42rpx};
                        height: #{80rpx};
                        float: left;
                        padding-top: #{24rpx};
                        padding-right: #{10rpx};
                        image {
                            height: #{32rpx};
                            width: #{32rpx};
                            display: block;
                        }
                    }
                }
            }
        }
        .refuse {
            font-size: #{36rpx};
            color: #353535;
            text-align: center;
            background-color: #fff;
            image {
                height: #{160rpx};
                width: #{160rpx};
                margin: #{80rpx} auto #{40rpx};
            }
            view {
                margin-bottom:#{25rpx};
            }
            .refuse-reason {
                margin:#{10rpx} 0 #{76rpx};
            }
            .refuse-info {
                font-size: #{28rpx};
                color: #999;
                border-top: #{1rpx} solid #e2e2e2;
                width: #{520rpx};
                margin: 0 auto;
                margin-bottom: 0;
                padding-top: #{30rpx};
                padding-left: #{20rpx};
                text-align: left;
                text {
                    color: #666;
                    margin-left: #{15rpx};
                }
            }
        }
        .wait {
            color: #666;
            font-size: #{32rpx};
            text-align: center;
            background-color: #fff;
            view {
                margin-bottom: #{68rpx};
            }
            .up {
                width: #{510rpx};
                margin: 0 auto #{68rpx};
            }
            image {
                height: #{270rpx};
                width: #{380rpx};
                margin: #{120rpx} auto #{60rpx};
            }
        }
    }

    .submit-area {
        background-color: #fff;
        padding-bottom: #{60rpx};
        margin-bottom: 0!important;
    }

    .apply-sumbit {
        margin: 0 auto #{60rpx};
        button {
            height: #{80rpx};
            line-height: #{80rpx};
            width: #{702rpx};
            margin: 0 auto;
            border-radius: #{40rpx};
            background-color: #ff4544;
            color: #fff;
            font-size: #{32rpx};
            text-align: center;
        }
        &.be-apply {
            width: #{702rpx};
        }
    }
    .apply-sumbit.to-mall,.apply-sumbit.to-mall button {
        width: #{320rpx};
        margin-bottom: 0;
    }

    .apply-sumbit.to-apply,.apply-sumbit.to-apply button {
        width: #{440rpx};
    }
    .choose-level {
        padding: #{80rpx} #{40rpx};
        font-size: #{32rpx};
        color: #353535;
        background-color: #fff;
        >view {
            border-bottom: #{2rpx} solid #e2e2e2;
            margin-bottom: #{36rpx};
        }
        .choose-level-item {
            color: #999;
            padding-top: #{20rpx};
            padding-bottom: #{34rpx};
            .district-list {
                width: #{530rpx};
                text {
                    margin: 0 #{10rpx};
                }
            }
            .more {
                width: #{22rpx};
                height: #{12rpx};
                margin-left: #{12rpx};
            }
        }
    }
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        width: 100%;
        z-index: 99;
        background-color: rgba(0, 0, 0, 0.3);
        .dialog-list {
            padding: #{46rpx} #{30rpx};
            .dialog-item {
                margin: #{10rpx};
                height: #{62rpx};
                line-height: #{60rpx};
                display: inline-block;
                padding: 0 #{32rpx};
                font-size: #{32rpx};
                color: #353535;
                border-radius: #{32rpx};
                border: #{2rpx} solid #bbbbbb;
                &.active {
                    color: #ff4544;
                    border: #{2rpx} solid #ff4544;
                }
            }
        }
        .protocol {
            position: relative;
            z-index: 99;
            background-color: #fff;
            width: 80%;
            border-radius: #{20rpx};
            .protocol-name {
                text-align: center;
                height: #{100rpx};
                line-height: #{100rpx};
                color: #666;
            }
            .protocol-content {
                padding: #{10rpx} #{20rpx};
                height: #{720rpx};
                overflow: auto;
                color: #353535;
            }
            .read-over {
                height: #{100rpx};
                text-align: center;
                line-height: #{100rpx};
                background-color: #ff4544;
                color: #fff;
                font-size: #{30rpx};
                border-bottom-right-radius: #{20rpx};
                border-bottom-left-radius: #{20rpx};
            }
            image {
                height: #{200rpx};
                width: #{200rpx};
            }
        }
        .select-dialog {
            &.iphone_x {
                padding-bottom: #{50rpx};
            }
            position: fixed;
            border-top-left-radius: #{16rpx};
            border-top-right-radius: #{16rpx};
            width: 100%;
            bottom: 0;
            left: 0;
            background-color: #fff;
            .select-title {
                border-top-left-radius: #{16rpx};
                border-top-right-radius: #{16rpx};
                position: relative;
                width: 100%;
                height: #{100rpx};
                line-height: #{100rpx};
                border-bottom: #{2rpx} solid #e2e2e2;
                text-align: center;
                font-size: #{32rpx};
                .submit-btn {
                    position: absolute;
                    right: #{24rpx};
                    top: 0;
                    color: #ff4544;
                }
            }
            picker-view {
                width: 100%;
                .picker-view {
                    line-height: #{88rpx};
                    text-align:center;
                    font-size: #{32rpx};
                    &.sure-color {
                        font-size: #{36rpx};
                    }
                }
            }
        }
    }
</style>