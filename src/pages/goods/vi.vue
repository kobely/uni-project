<template>
    <view class="video">
        <video :src="src" :controls="controls" :show-play-btn="false" :muted="!load||!play"
               :style="{ height: height }" :loop="true" @play="continuePlay"
               :enable-progress-gesture="false" :objectFit="objectFit" @ended="playEnd"
               :initial-time="startTime"
               :id="`video_${src}`" :ref="`video_${src}`" class="video" @timeupdate="timeupdate">
        </video>
    </view>
</template>

<script>

export default{
    components:{

    },
    props:{
        objectFit:{
            type:String,
            default:'contain'
        },
        controls:{
            type:Boolean,
            default:false
        },
        play:{
            type:Boolean,
            default:false
        },
        initialTime:{
            type:Number,
            default:0
        },
        src:{
            type:String,
            default:''
        },
        height:{
            type:String,
            default:''
        },
    },
    data(){
        return{
            load:false,
            videoCtx: null,
            playFirst:true,
            timer:null
        }
    },
    beforeCreate() {

    },
    mounted() {
        this.videoCtx = uni.createVideoContext(`video_${this.src}`,this)
        //#ifndef MP-WEIXIN
        setTimeout(()=>{this.videoCtx.play();},200)
        // #endif
    },
    methods:{
        continuePlay() {
            if(!this.load){
                setTimeout(()=>{
                    this.load = true
                    this.videoPlay()
                },1000)
            }
        },
        playEnd() {},
        timeupdate() {},
        videoPlay:function(){
            if(this.timer) clearTimeout(this.timer)
            this.timer = setTimeout(()=>{
                if(this.play){
                    this.videoCtx.play();
                    this.playFirst = false
                }else{
                    this.videoCtx.pause();
                    this.$emit('pause',this.time)
                }
            })

        },
    },
    watch:{
        play: function (newVal,oldVal){
            if(this.load) this.videoPlay()
        }
    },
    computed:{
        startTime(){
            return this.initialTime
        }
    }
}
</script>

<style scoped lang="scss">
    .video{
        display: flex;
        width: 750rpx;
        justify-content: center;
        align-items: center;
    }
</style>