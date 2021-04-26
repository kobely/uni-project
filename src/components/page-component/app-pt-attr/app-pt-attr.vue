<template>
    <view class="app-pt-attr dir-top-nowrap">
        <text class="app-title">拼团人数</text>
        <view class="app-content dir-left-wrap">
            <text class="app-item" v-for="(item, index) in groups" :class="select == item.groups.id ? 'app-active-item': ''"
                  :style="{'background-color': select == item.groups.id ?theme.background : '#f2f2f2'}"
                  @click="active(item)" :key="index">{{item.groups.people_num}}人团</text>
        </view>
    </view>
</template>

<script>

export default {
    name: 'app-pt-attr',

    props: {
        groups: {
            type: Array,
            default() {
                return [];
            }
        },
        selectGroupAttrId: String,
        theme: Object
    },
    methods: {
        active: function(item) {
            this.$emit('click',item);
        }
    },
    computed: {
        select: function() {
            return this.selectGroupAttrId
        }
    }
}
</script>

<style scoped lang="scss">
.app-item {
    display: inline-block;
    margin-right: #{20rpx};
    margin-bottom: #{20rpx};
    padding: #{15upx 24upx};
    border-radius: #{8rpx};
    color: #353535;
}
.app-pt-attr {
    width: 100%;
    .app-title {
        color: #666666;
        margin-bottom: #{20rpx};
    }

    .app-active-item {
        color: #ffffff;
    }
}
</style>