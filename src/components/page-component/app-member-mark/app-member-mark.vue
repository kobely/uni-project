<template>
    <view class="member dir-left-nowrap cross-center main-center"
          :class="sign !== 'gift' ? '' : theme+'-color ' + theme + '-background-o'"
          :style="{width: width,height: height,lineHeight: height,color:sign !== 'gift' && theme ? theme.color : '','background-color': sign !== 'gift' && theme ? theme.background_o : ''}">会员价</view>
</template>

<script>
    export default {
        name: "app-member-mark",
        props: {
            sign: String,
            width: {
                type: String,
                default() {
                    return `68rpx`;
                }
            },
            height: {
                type: String,
                default() {
                    return `28rpx`;
                }
            },
            theme: [Object,String]
        },
    }
</script>

<style scoped lang="scss">
    .member {
        border: #{1rpx} solid;
        border-radius: #{8rpx};
        font-size: #{20rpx};
        transform: rotateZ(360deg)
    }
</style>