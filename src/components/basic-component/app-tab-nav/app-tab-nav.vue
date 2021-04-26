<template>
    <view>
        <view 
            :class="[shadow ? `main-between app-nav shadow` : 'main-between app-nav']"
            :style="[
                {
                    'line-height': `${setHeight ? setHeight : 90}rpx`,
                    'font-size': `${fontSize ? fontSize : 28}rpx`,
                    'height': `${setHeight ? setHeight : 90}rpx`,
                    'top': `${setTop > 0 ? setTop + 'rpx' : '0'}`,
                    'backgroundColor': `${background ? background : '#fff'}`,
                }
            ]"
        >
            <view @click="handleClick" v-for="(item) in tabList" :key="item.id" :data-id="item.id" class="box-grow-1 nav-item"
            :style="[
                {
                    'borderBottom': `${border ? 1 : 0}rpx solid #e2e2e2`,
                }
            ]"
            >
                <text
                    :class="[item.id == activeItem ? `active-text` : '']"
                    :style="[
                        {
                            'color': `${ item.id == activeItem ? theme.color : '#353535'}`,
                            'border-color':  `${ item.id == activeItem ? theme.color : ''}`,
                            'height': `${setHeight ? setHeight : 90}rpx`,
                            'padding': `0 ${padding}rpx`,
                        }
                    ]"
                >{{item.name}}</text>
            </view>
        </view>
        <view
            :style="[
                {'height': `${placeHeight ? placeHeight : 90}rpx`}
            ]"
        >
        </view>
    </view>
</template>

<script>

    export default {
        name: 'app-tab-nav',
        props: {
            background: String,
            setTop: {
                type: [Number, String]
            },
            padding: {
                default: 45,
                type: [Number, String],
            },
            setHeight: Number,
            placeHeight: Number,
            fontSize: Number,
            theme: {
                type: Object,
            },
            border: {
                default: true,
                type: Boolean,
            },
            shadow: {
                default: true,
                type: Boolean,
            },
            activeItem: {
                type: [Number, String]
            },
            tabList: Array
        },
        methods: {
            handleClick(e) {
                this.$emit('click', e);
            }
        },
       
    }
</script>

<style scoped lang="scss">
    .app-nav {
        color: #353535;
        width: 100%;
        position: fixed;
        left: 0;
        background-color: #fff;
        z-index: 11;
        .nav-item {
            text-align: center;
            text {
                display: inline-block;
            }
        }
        .active-text {
            color: #ff4544;
            border-bottom: #{4rpx} solid #ff4544;
        }
    }
    .app-nav.shadow {
        box-shadow: 0 #{2rpx} #{10rpx} rgba(0, 0, 0, 0.06);
    }
    .blue-m-text {
        color: #446dfd;
    }
</style>