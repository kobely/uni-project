<template>
	<text :style="{color: color, fontSize: `${fontSize}rpx`}">{{html}}</text>
</template>

<script>
    export default {
        name: 'app-timer',
	    data() {
            return {
                time: null,
	            html: ''
            }
	    },
	    props: {
            startTime: {
                type: String,
	            default: function() {
	                return '2019-8-30 10:00:00';
	            }
            },
            color: {
                type: String,
	            default: function() {
	                return 'white';
	            }
            },
            fontSize: {
                type: String,
	            default: function() {
	                return '26';
	            }
            }
	    },
	    beforeDestroy() {
            clearInterval(this.time);
        },
	    watch: {
            startTime: {
                handler: function(v) {
                    let timelog = new Date(v.replace(/-/g, '/'));
                    this.time = setInterval(() =>{
                        let timenow = new Date();//获取当前时间
                        let time = timelog.getTime() - timenow.getTime();//时间差的所有毫秒数
                        let day = parseInt((time/1000/60/60/24)%30);
                        let hou = parseInt((time/1000/60/60)%24);
                        let min = parseInt((time/1000/60)%60);
                        let sec = parseInt((time/1000)%60);
                        this.html = day+"天"+hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec);
                    },1000);
                },
	            immediate: true
            }
	    }
    }
</script>
