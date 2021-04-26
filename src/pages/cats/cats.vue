<template>
    <app-layout>
        <template v-if="loading">
            <view class="app-search" v-if="search_bool">
                <app-search-for></app-search-for>
            </view>

            <!-- 样式一 -->
            <view v-if="cat_style.cat_style === '1'" class="margin-fixed">
                <style-one
                    :list="list"
                    :goods_list="goods_list"
                ></style-one>
            </view>

            <!-- 样式二 -->
            <view v-else-if="cat_style.cat_style === '2'" class="margin-fixed">
                <style-two
                    :list="list"
                    :windowHeight="windowHeight"
                    :windowWidth="windowWidth"
                    :botHeight="botHeight"
                    :setHeight="setHeight"
                    :activeIndex="activeIndex"
                    @active="activeThree"
                    @route_advert="route_advert"
                    :theme="getTheme"
                ></style-two>
            </view>

            <!-- 样式三 -->
            <view v-else-if="cat_style.cat_style === '3'"  class="margin-fixed">
                <style-three
                    :list="list"
                    :goods_list="goods_list"
                ></style-three>
            </view>

            <!-- 样式四 -->
            <view v-else-if="cat_style.cat_style === '4'"  class="margin-fixed">
                <style-four
                    :list="list"
                    :windowHeight="windowHeight"
                    :windowWidth="windowWidth"
                    :botHeight="botHeight"
                    :setHeight="setHeight"
                    :activeIndex="activeIndex"
                    @active="activeThree"
                    @route_advert="route_advert"
                    :theme="getTheme"
                ></style-four>
            </view>

            <!-- 样式五 -->
            <view v-else-if="cat_style.cat_style === '5'"  class="margin-fixed">
                <style-five
                    :list="list"
                    @active="activeOne"
                    @setNav="activeTwo"
                    :activeIndex="activeIndex"
                    :activeIndexTwo="activeIndexTwo"
                    :goods_list="goods_list"
                    :theme="getTheme"
                    :is_over_goods="is_over_goods"
                    :goodsLoading="goodsLoading"
                ></style-five>
            </view>

            <!-- 样式六 -->
            <view v-else-if="cat_style.cat_style === '6'"  class="margin-fixed">
                <style-six
                    :list="list"
                    :setHeight="setHeight"
                    :activeIndex="activeIndex"
                    :goods="goods"
                    :botHeight="botHeight"
                    @active="activeThree"
                    @route_advert="route_advert"
                    :theme="getTheme"
                ></style-six>
            </view>

            <!-- 样式七 -->
            <view v-else-if="cat_style.cat_style === '7'"  class="margin-fixed">
                <style-seven
                    :list="list"
                    :setHeight="setHeight"
                    :activeIndex="activeIndex"
                    :goods="goods"
                    :botHeight="botHeight"
                    :windowHeight="windowHeight"
                    :windowWidth="windowWidth"
                    @active="activeThree"
                    @route_advert="route_advert"
                    :theme="getTheme"
                ></style-seven>
            </view>

            <!-- 样式八 -->
            <view v-else-if="cat_style.cat_style === '8'" class="margin-fixed">
                <style-eight
                    :list="list"
                    :goods_list="goods_list"
                    @active="active"
                    :theme="getTheme"
                    :is_over_goods="is_over_goods"
                    :goodsLoading="goodsLoading"
                ></style-eight>
            </view>

            <!-- 样式九 -->
            <view v-else-if="cat_style.cat_style === '9'" class="margin-fixed">
                <style-nine
                    :list="list"
                    :setHeight="setHeight"
                    :activeIndex="activeIndex"
                    :goods_list="goods_list"
                    @active="activeThree"
                    @lower="lower"
                    @requestGoods="requestGoods"
                    @attr="attr"
                    @route_advert="route_advert"
                    :theme="getTheme"
                    :is_over_goods="is_over_goods"
                ></style-nine>
            </view>

            <!-- 样式十 -->
            <view v-else-if="cat_style.cat_style === '10'" class="margin-fixed">
                <style-ten
                    :list="list"
                    :setHeight="setHeight"
                    :activeIndex="activeIndex"
                    :goods_list="goods_list"
                    :activeIndexTwo="activeIndexTwo"
                    @active="activeThree"
                    @lower="lower"
                    @requestGoods="requestGoods"
                    @setNav="activeTwo"
                    @attr="attr"
                    @route_advert="route_advert"
                    :theme="getTheme"
                    :is_over_goods="is_over_goods"
                ></style-ten>
            </view>

            <!-- 样式十一 -->
            <view v-else-if="cat_style.cat_style === '11'" class="margin-fixed">
                <style-eleven
                    :list="list"
                    :setHeight="setHeight"
                    :activeIndex="activeIndex"
                    :goods_list="goods_list"
                    :activeIndexTwo="activeIndexTwo"
                    @active="activeThree"
                    @lower="catLower"
                    @requestCatList="activeRequest"
                    @setNav="requestCatList"
                    @attr="attr"
                    @route_advert="route_advert"
                    :theme="getTheme"
                    :is_over_goods="is_over_goods"
                ></style-eleven>
            </view>

            <app-attr
                ref="attr"
                :goods="item"
                :select-attr="selectAttr"
                :attr-group-list="attrGroup"
                :show="show"
                @attrtap="onAttr"
                :previewUrl="previewUrl"
                :submitUrl="submitUrl"
                :theme="getTheme"
            ></app-attr>
        </template>
    </app-layout>
</template>

<script>
    import { mapGetters, mapState } from 'vuex';
    import styleOne from './style-one.vue';
    import styleTwo from './style-two';
    import styleThree from './style-three.vue';
    import styleFour from './style-four.vue';
    import styleFive from './style-five.vue';
    import styleSix from './style-six.vue';
    import styleSeven from './style-seven.vue';
    import styleEight from './style-eight.vue';
    import styleNine from './style-nine.vue';
    import styleTen from './style-ten.vue';
    import styleEleven from './style-eleven.vue';
    import appSearchFor from '../../components/page-component/app-search-for/app-search-for.vue';
    import routeJump from '../../core/routeJump.js';
    import appAttr from '../../components/page-component/app-attr/app-attr.vue';

    export default {
        components: {
            'app-search-for': appSearchFor,
            'style-one': styleOne,
            'style-two': styleTwo,
            'style-three': styleThree,
            'style-four': styleFour,
            'style-five': styleFive,
            'style-six': styleSix,
            'style-seven': styleSeven,
            'style-eight': styleEight,
            'style-nine': styleNine,
            'style-ten': styleTen,
            'style-eleven': styleEleven,
            'app-attr': appAttr
        },
        data() {
            return {
                search_bool: true,
                list: [],
                goods: [],
                request: true,
                page: 1,
                classId: 0,
                activeIndex: 0,
                activeIndexTwo: 0,
                over: false,
                scrollHeight: 0,
                tabbarbool: true,
                cat_id: 0,
                cat_ids: [],
                againLower: true,

                goods_list: [],
                page_count: 1,

                select_cat_id: 0,
                first_id: 0,
                loading: false,

                selectAttr: {},
                previewUrl: '',
                submitUrl: '',
                show: 0,
                attrGroup: [],
                item: {},
                is_over_goods: true,
                options: {},
                goodsLoading: false
            }
        },
        computed: {
            ...mapGetters('mallConfig', {
                cat_style: 'getCatStyle',
                getTheme: 'getTheme'
            }),
            ...mapState('gConfig', {
                windowHeight: state => state.systemInfo.windowHeight,
                windowWidth: state => state.systemInfo.windowWidth
            }),
            ...mapGetters('iPhoneX', {
                botHeight: 'getBotHeight'
            }),
            ...mapState('mallConfig', {
                mall: state => state.mall,
            }),
            setHeight() {
                let bottom = 0;
                if (this.tabbarbool) {
                    bottom = this.botHeight;
                }
                const res = uni.getSystemInfoSync();

                return (res.windowHeight * (750 / this.windowWidth)) - bottom - 88;
            }
        },
        onReachBottom() {
            let cat_style = this.cat_style.cat_style;
            if (cat_style === '3' || cat_style === '1') return;
            if (this.page < this.page_count) {
                this.page++;
                this.$request({
                    url: this.$api.default.goods_list,
                    method: 'get',
                    data: {
                        page: this.page,
                        cat_id: this.cat_id,
                    }
                }).then(res => {
                    if (res.code === 0) {
                        if (cat_style === '8' || cat_style === '5') {
                            this.goodsLoading = true;
                        }
                        this.goods_list.push(...res.data.list);
                    }
                });
            } else {
                if (cat_style === '8' || cat_style === '5') {
                    this.goodsLoading = false;
                }
                uni.showToast({
                    title: '暂无更多商品',
                    icon: 'none'
                });
            }
        },
        methods: {
            onAttr(data) {
                this.selectAttr = data;
            },
            attr({previewUrl, submitUrl, attr_groups, goods}) {
                this.previewUrl = previewUrl;
                this.submitUrl = submitUrl;
                this.attrGroup = attr_groups;
                this.item = goods;
                this.show = Math.random();
            },
            route_advert(data) {
                routeJump({
                    open_type: data.advert_open_type,
                    params: data.advert_params,
                    page_url: data.advert_url
                });
            },
            // 点击导航栏
            active(item) {
                this.page = 1;
                this.goods_list = [];
                this.cat_id = item.id;
                this.select_cat_id = item.id;
                for (let i = 0; i < this.list.length; i++) {
                    this.list[i].active = false;
                }
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].id === item.id) {
                        this.list[i].active = true;
                    }
                }
                this.is_over_goods = false;
                this.$request({
                    url: `${this.$api.default.goods_list}&page=${this.page}&cat_id=${item.id}`
                }).then(res => {
                    if (res.code === 0) {
                        this.goods_list.push(...res.data.list);
                        this.page_count = res.data.pagination.page_count;
                        this.goodsLoading = this.page_count > 1;
                        this.is_over_goods = true;
                    }
                });
            },
            // 下拉分页请求
            req() {
                this.$request({
                    url: `${this.$api.default.goods_list}&page=${this.page}&cat_id=${this.classId}`
                }).then(response => {
                    if (response.data.list.length > 0) {
                        this.goods.push(...response.data.list);
                    } else {
                        this.over = true;
                    }
                });
            },
            activeOne(item) {
                this.page = 1;
                this.activeIndexTwo = 0;
                this.cat_id = item.id;
                this.select_cat_id = item.id;
                this.is_over_goods = false;
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].active !== item.active) {
                        this.list[i].active = false;
                    }
                }
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].id === item.id) {
                        this.list[i].active = true;
                        this.activeIndex = i;
                    }
                }
                if (this.cat_style.cat_style === '5') this.goods_list = [];

                if (this.list[this.activeIndex].child.length === 0) {
                    this.$request({
                        url: `${this.$api.default.goods_list}&page=${this.page}&cat_id=${item.id}`
                    }).then(res => {
                        let { list, pagination } = res.data;
                        this.goods_list = list;
                        this.is_over_goods = true;
                        this.page = 1;
                        this.cat_id = item.id;
                        this.select_cat_id = item.id;
                        this.page_count = pagination.page_count;
                    });

                } else {
                    this.$request({
                        url: `${this.$api.default.goods_list}&page=${this.page}&cat_id=${this.list[this.activeIndex].child[0].id}`
                    }).then(res => {
                        let { list, pagination } = res.data;
                        this.goods_list = list;
                        this.is_over_goods = true;
                        this.page = 1;
                        this.cat_id = this.list[this.activeIndex].child[0].id;
                        this.select_cat_id = item.id;
                        this.page_count = pagination.page_count;
                    });
                }
            },
            async activeTwo({item, index}) {
                this.page = 1;
                this.activeIndexTwo = index;
                this.select_cat_id = item.id;
                this.cat_id = item.id;
                this.select_cat_id = item.id;
                this.is_over_goods = false;
                const res = await this.$request({
                    url: this.$api.default.goods_list,
                    method: 'get',
                    data: {
                        page: 1,
                        cat_id: item.id
                    }
                });
                if (res.code === 0) {
                    let { list, pagination } = res.data;
                    this.goods_list = [];
                    this.goods_list = list;
                    this.is_over_goods = true;
                    this.page_count = pagination.page_count;
                }
            },
            activeThree(item) {
                this.cat_id = item.id;
                this.select_cat_id = item.id;
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].active !== item.active) {
                        this.list[i].active = false;
                    }
                    if (this.list[i].id === item.id) {
                        this.list[i].active = true;
                        this.activeIndex = i;
                    }
                }
            },

            async catLower() {
                if (!this.againLower) return;
                this.againLower = false;
                let goods_list = this.goods_list[this.goods_list.length - 1];
                const res = await this.$request({
                    url: this.$api.default.cat_goods,
                    method: 'get',
                    data: {
                        cat_ids: JSON.stringify(this.cat_ids),
                        cat_id: goods_list.id,
                        offset: goods_list.offset
                    }
                });
                if (res.code === 0) {
                    if (res.data.list[0].id === goods_list.id && res.data.list[0].goods_list.length > 0) {
                        this.goods_list[this.goods_list.length - 1].goods_list.push(...res.data.list[0].goods_list);
                        this.goods_list[this.goods_list.length - 1].offset = res.data.list[0].offset;
                    }
                    for (let i = 1; i < res.data.list.length; i++) {
                        this.goods_list.push(res.data.list[i]);
                    }
                    this.againLower = true;
                }
            },

            activeRequest({item}) {
                this.goods_list = [];
                console.log(item);
                if (item.child.length !== 0) {
                    this.requestCatList({
                        item: item.child[0], index: 0
                    });
                }
            },

            async requestCatList({item, index}) {
                this.page = 1;
                this.cat_id = item.id;
                this.select_cat_id = item.id;
                this.activeIndexTwo = index;
                this.goods_list = [];
                if (item.child.length !== 0) {
                    this.is_over_goods = false;
                    this.cat_ids = [];
                    for (let i = 0; i < item.child.length; i++) {
                        this.cat_ids.push(item.child[i].id);
                    }
                    const res = await this.$request({
                        url: this.$api.default.cat_goods,
                        method: 'get',
                        data: {
                            cat_ids: JSON.stringify(this.cat_ids),
                            cat_id: item.child[0].id,
                            offset: 0
                        }
                    });
                    if (res.code === 0) {
                        this.is_over_goods = true;
                        this.goods_list = res.data.list;
                    }
                }
            },
            // 求情商品列表
            async requestGoods({item, index}) {
                this.page = 1;
                this.cat_id = item.id;
                this.select_cat_id = item.id;
                this.goods_list = [];

                this.is_over_goods = false;
                if (this.cat_style.cat_style === '10' && index !== undefined && this.list[index].child.length !== 0) {
                    this.activeIndexTwo = 0;
                    this.cat_id = this.list[index].child[0].id;
                }
                const res = await this.$request({
                    url: this.$api.default.goods_list,
                    method: 'get',
                    data: {
                        page: this.page,
                        cat_id: this.cat_id
                    }
                });
                if (res.code === 0) {
                    this.is_over_goods = true;
                    this.goods_list = res.data.list;
                    this.goodsLoading = true;
                    this.page_count = res.data.pagination.page_count;
                }
            },

            // 分页请求商品
            async lower(data) {
                if (this.page < this.page_count) {
                    this.page++;
                    const res = await this.$request({
                        url: this.$api.default.goods_list,
                        method: 'get',
                        data: {
                            page: this.page,
                            cat_id: data.id
                        }
                    });
                    if (res.code === 0) {
                        this.goods_list.push(...res.data.list);
                    }
                } else {
                    uni.showToast({
                        title: '暂无更多商品',
                        icon: 'none'
                    })
                }
            },

            // 处理数据
            dataProcessing(list) {
                for (let i = 0; i < list.length; i += 2) {
                    if (i + 1 !== list.length) {
                        this.goods_list.push([list[i], list[i + 1]]);
                    } else {
                        this.goods_list.push([list[i]]);
                    }
                }
            },

            async requestCat(cat_id, select_cat_id) {
                this.loading = false;
                const res = await this.$request({
                    url: this.$api.default.cat_list,
                    method: 'get',
                    data: {
                        cat_id: cat_id ? cat_id : '',
                        select_cat_id: select_cat_id ? select_cat_id : ''
                    }
                });
                if (res.code === 0) {
                    this.list = res.data.list;
                    // 分类跳转
                    if (this.cat_style.cat_style === '1' && this.list.length === 0) {
                         this.search_bool = false;
                        return;
                    }
                     if (this.cat_style.cat_style === '2' || this.cat_style.cat_style === '1') {
                        return;
                    }
                    if (this.cat_style.cat_style === '3' && this.list.length === 0) {
                        this.search_bool = false;
                        return;
                    }
                    if (cat_id || select_cat_id) {
                        if (this.cat_style.cat_style === '11') {
                            this.cat_ids = [];
                            this.list.map((item, index) => {
                                if (item.active) {
                                    this.activeIndex = index;
                                }
                            });
                            if (this.list[this.activeIndex].child.length === 0) return;
                            for (let i = 0; i < this.list[this.activeIndex].child[0].child.length; i++) {
                                this.cat_ids.push(this.list[this.activeIndex].child[0].child[i].id);
                            }
                            if (this.cat_ids.length === 0) return;
                            const res = await this.$request({
                                url: this.$api.default.cat_goods,
                                method: 'get',
                                data: {
                                    cat_ids: JSON.stringify(this.cat_ids),
                                    cat_id: this.cat_ids[0],
                                    offset: 0
                                }
                            });
                            if (res.code === 0) {
                                this.goods_list = res.data.list;
                            }
                            return;
                        }
                        if (this.cat_style.cat_style === '6' || this.cat_style.cat_style === '7') {
                            this.list.map((item, index) => {
                               if (item.active) {
                                   this.activeIndex = index;
                               }
                            });
                            return;
                        }
                        if (this.list.length > 0) {
                            for (let i = 0; i < this.list.length; i++) {
                                if (this.list[i].active) {
                                    this.cat_id = this.list[i].id;
                                }
                            }
                        }
                        if ((this.cat_style.cat_style === '5' || this.cat_style.cat_style === '10') && this.list.length > 0 && this.list[0].child.length > 0) {
                            for (let i = 0; i < this.list.length; i++) {
                                if (this.list[i].active) {
                                    this.cat_id = this.list[i].child[0].id;
                                }
                            }
                        }

                        if (this.list.length === 0 && (this.cat_style.cat_style === '4')) {
                            this.search_bool = false;
                            return;
                        }

                        const res = await this.$request({
                            url: this.$api.default.goods_list,
                            method: 'get',
                            data: {
                                page: 1,
                                cat_id: this.cat_id,
                            }
                        });
                        if (res.code === 0) {
                            this.goods_list = res.data.list;
                            this.page_count = res.data.pagination.page_count;
                            if (this.list.length === 0 && this.goods_list.length === 0) {
                                this.search_bool = false;
                            }
                        }
                    } else {
                        if (this.list.length > 0) {
                            if (this.cat_style.cat_style === '11') {
                               this.cat_ids = [];
                               if (this.list.length === 0 || this.list[0].child.length === 0) return;
                                for (let i = 0; i < this.list[0].child[0].child.length; i++) {
                                    this.cat_ids.push(this.list[0].child[0].child[i].id);
                                }
                                if (this.cat_ids.length === 0) return;
                                const res = await this.$request({
                                    url: this.$api.default.cat_goods,
                                    method: 'get',
                                    data: {
                                        cat_ids: JSON.stringify(this.cat_ids),
                                        cat_id: this.cat_ids[0],
                                        offset: 0
                                    }
                                });
                                if (res.code === 0) {
                                    this.goods_list = res.data.list;
                                }
                                return;
                            }
                            this.cat_id = this.list[0].id;

                            if ((this.cat_style.cat_style === '5' || this.cat_style.cat_style === '10') && this.list[0].child.length > 0) {
                                this.cat_id = this.list[0].child[0].id;
                            }
                            const res = await this.$request({
                                url: this.$api.default.goods_list,
                                method: 'get',
                                data: {
                                    page: 1,
                                    cat_id: this.cat_id,
                                }
                            });
                            if (res.code === 0) {
                                this.goods_list = res.data.list;
                                this.page_count = res.data.pagination.page_count;
                            }
                        } else {
                            this.search_bool = false;
                        }
                    }
                }
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.$commonLoad.onload();

            this.options = options;
            setTimeout(() => {
                this.tabbarbool = this.$children[0].tabbarbool;
            }, 500);
            this.cat_id = options.cat_id;
            this.first_id = options.cat_id;
            if (options.first_id && options.select_cat_id) {
                this.requestCat(options.first_id, options.select_cat_id).then(() => {
                    this.loading = true;
                });
            } else if (!options.first_id && options.select_cat_id) {
                this.requestCat('', options.select_cat_id).then(() => {
                    this.loading = true;
                });
            } else if (!options.first_id && !options.select_cat_id) {
                this.requestCat(options.cat_id).then(() => {
                    this.loading = true;
                });
            }
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            });
            // #endif
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                path: '/pages/cats/cats',
                title: this.$children[0].navigationBarTitle,
                params: {
                    cat_id: this.first_id,
                    first_id: this.first_id,
                    select_cat_id: this.select_cat_id
                }
            });
        },
        // #endif
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            let { setting, name } = this.mall.setting;
            return this.$shareTimeline({
                title: setting.share_title ? setting.share_title : name,
                query: {
                    cat_id: this.first_id,
                    first_id: this.first_id,
                    select_cat_id: this.select_cat_id
                }
            });
        },
        // #endif
    }
</script>

<style lang="scss" scoped>
    .app-search {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1500;
    }
    .empty-search {
        height: #{88upx};
        width: #{750upx};
        background: #f7f7f7;
    }
    .margin-fixed {
        margin-top: #{88upx};
    }

    .app-top {
        width: $screen-width;
    }

</style>
