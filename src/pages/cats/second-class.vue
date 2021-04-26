<template>
    <view class="second-class dir-left-nowrap">
        <view class="spring-board" v-if="switchBool">
            <view class="ollapse main-right" @click="switchBool = false">
                <image :src="catsImg.ollapse" class="ollapse-icon"></image>
            </view>
            <view class="ollapse-view">
                <text class="item" v-for="(it, key) in list" :key="key"  :class="key == activeIndexTwo ? 'active': ''" :style="{'color': key == activeIndexTwo ? theme.color : ''}" @click="setNav(it, key)">
                    {{it.name}}
                </text>
            </view>
        </view>
        <scroll-view scroll-x
                     v-if="!switchBool"
            class="left dir-left-nowrap"
        >
            <view>
                <text class="item " v-for="(it, key) in list" :key="key" :class="key == activeIndexTwo ? 'active': ''" :style="{'color': key == activeIndexTwo ? theme.color : ''}" @click="setNav(it, key)">
                    {{it.name}}
                </text>
            </view>
        </scroll-view>
        <view class="right" v-if="!switchBool" @click="switchBool = true">
            <image :src="catsImg.expand" class="icon"></image>
        </view>
    </view>
</template>

<script>
    import { mapGetters, mapState } from 'vuex';
    export default {
        name: "second-class",

        props: ['list', `activeIndexTwo`, `theme`],

        computed: {
            ...mapState({
                catsImg: state => state.mallConfig.__wxapp_img.cats,
            })
        },
        data() {
            return {
                switchBool: false
            }
        },

        methods: {
            setNav(it, key) {
                this.switchBool = false;
                this.$emit('setNav',{
                    it, key
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .second-class {
        position: relative;
        height: #{106upx};
        width: #{528upx};
        background-color: #ffffff;
    }
    .left {
        width: #{448upx};
        white-space: nowrap;
        vertical-align: center;
        background-color: #ffffff;
        line-height: #{106upx};
    }
    .right {
        width: #{80upx};
        height: #{106upx};
        position: relative;
        box-shadow: #{-1upx 0 5upx -5upx} rgba(0, 0, 0, .2);
    }
    .item {
        display: inline-block;
        font-size: #{24upx};
        height: #{54upx};
        line-height: #{54upx};
        padding: #{0 20upx};
        border: #{1upx} solid #cccccc;
        border-radius: #{34upx};
        margin-right: #{16upx};
    }
    .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: #{56upx};
        height: #{56upx};
    }
    .ollapse {
        height: #{106upx};
        width: #{528upx};
        position: relative;
    }
    .ollapse-icon {
        position: absolute;
        top: 50%;
        right: #{12upx};
        width: #{56upx};
        height: #{56upx};
        transform: translateY(-50%);
    }
    .ollapse-view > text {
        margin-bottom: #{20upx};
    }
    .spring-board {
        position: absolute;
        top: 0;
        left: 0;
        width: #{528upx};
        z-index: 1000;
        background-color: #ffffff;
    }
    .active {
        border: #{1rpx} solid;
    }
</style>