<template>
   <view>
       <view v-if="type === 'global'" class="app-loading app-loading-global">
           <view class="app-loading-image app-loading-global-image" :style="{'background-image': `url(${background})`}"></view>
           <text :style="{'color': color}" class="app-loading-global-text" v-if="text">{{text}}</text>
       </view>
       <view v-else-if="type === 'toast'" class="app-loading app-loading-toast">
            <view class="app-loading-image app-loading-toast-image"
                  :style="{'background-image': `url(${background})`}"
            ></view>
            <text :style="{'color': color}" class="app-loading-toast-text" v-if="text">{{text}}</text>
       </view>
   </view>
</template>

<script>
    export default {
        name: 'app-loading',
        props: {
            type: {
                type: String,
                default() {
                    return "";
                }
            },
            text: {
                type: String,
                default() {
                    return "";
                }
            },
            color: {
                type: String,
                default() {
                    return "";
                }
            },
            backgroundImage: {
                type: String,
	            default() {
                    return "";
	            }
            },
        },
	    computed: {
            background: function() {
                return this.backgroundImage;
            }
	    }
    }
</script>

<style scoped lang="scss">

    .app-loading {
        position: fixed;
        z-index: 1501;
    }
    .app-loading-toast {
        top: 50%;
        left:50%;
        transform: translate(-50%, -50%);
    }
    .app-loading-global {
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(31,31,31, .5);
    }
    .app-loading-global-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .app-loading-global-image {
        position: absolute;
        top: 40%;
        left: 50%;
        width: #{80rpx};
        height: #{80rpx};
        border-radius: 50%;
        transform: translate(-50%, -50%);
    }
    .app-loading-toast-image {
        width: #{130rpx};
        height: #{130rpx};
        border-radius: 50%;
    }
    .app-loading-toast {
        width: #{80rpx};
        height: #{80rpx};
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: #{20rpx};
        color: white;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content:center;
        align-items: center;
    }
    .app-loading-toast-text {
        font-size:#{30rpx};
    }
    .app-loading-image {
        opacity: .8;
        background-size: 100% 100%;
    }
</style>