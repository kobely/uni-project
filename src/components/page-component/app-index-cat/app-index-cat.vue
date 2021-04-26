<template>
    <view class="u-index-cat">
        <view v-for="item in newData" :key="item.relation_id">
            <view class="cross-center cat-top"  @click="route(item.relation_id)">
                <view class="box-grow-1 main-center">
                    <image v-if="item.cat_pic_url" class="cat-pic-url" :src="item.cat_pic_url" ></image>
                    <text class="u-cat-name">{{item.name}}</text>
                </view>
                <view class="cross-center u-more">
                    <text class="u-more-text">更多</text>
                    <image class="u-arrow-right" src="/static/image/icon/arrow-right.png"></image>
                </view>
            </view>
            <u-ordinary-list @buyProduct="buyProduct" :is-under-line-price="isListUnderlinePrice == 1 ? true : false" :list="item.goods" :theme="theme" :list-style="item.list_style | listStyle"></u-ordinary-list>
        </view>
    </view>
</template>

<script>
    import uOrdinaryList from '../../page-component/u-goods-list/u-ordinary-list.vue';
    import {mapState} from "vuex";

    export default {
        name: "app-index-cat",
        components: {
            uOrdinaryList
        },
        props: {
            theme: {
                type: Object
            },
            page_id: {
                type: Number
            },
            index: {
                type: Number
            },
            is_required: {
                type: Boolean
            }
        },
        data() {
            return {
                newData: {}
            }
        },
        methods: {
            route(relation_id) {
                uni.navigateTo({
                    url: `/pages/goods/list?cat_id=${relation_id}`
                });
            },
            loadData() {
                this.$request({
                    url: this.$api.index.extra,
                    data: {
                        type: 'mall',
                        key: 'cat',
                        page_id: this.page_id,
                        index: this.index
                    }
                }).then(e => {
                    this.newData = e.data;
                    if (e.code === 0 && e.data) {
                        let storage = this.$storage.getStorageSync('INDEX_MALL');
                        console.log(storage);
                        storage.home_pages[this.index].list = this.newData;
                        this.$storage.setStorageSync('INDEX_MALL', storage);
                    }
                });
            },
            getStorage() {
                let storage = this.$storage.getStorageSync('INDEX_MALL');
                this.newData = storage.home_pages[this.index].list;
            },
            buyProduct(data) {
                this.$emit('buyProduct', data);
            }
        },
        mounted() {
            this.is_required ? this.loadData() : this.getStorage();
        },
        computed: {
            ...mapState({
                isListUnderlinePrice: state => state.mallConfig.mall.setting.is_list_underline_price
            })
        },
        filters: {
            listStyle(list_style) {
                return list_style === 1 ? -1 : list_style === 2 ? 2 : list_style === 3 ? 3 : null;
            }
        }
    }
</script>

<style scoped lang="scss">
    .u-index-cat {
        background-color: #ffffff;
    }
    .cat-top {
        height: 80upx;
        padding: 0 24upx;
        position: relative;
    }
    .u-cat-name {
        color: #353535;
        font-size: 28upx;
    }
    .cat-pic-url {
        width: 40upx;
        height: 40upx;
        margin-right: 24upx;
    }
    .u-more {
        position: absolute;
        right: 24upx;
        top: 0;
        z-index: 10;
        height: 100%;
    }
    .u-more-text {
        font-size: 26upx;
        color: #999999;
    }
    .u-arrow-right {
        width: 12upx;
        height: 24upx;
        margin-left: 12upx;
    }
</style>