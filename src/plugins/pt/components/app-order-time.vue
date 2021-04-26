<template>
	<text>{{html}}</text>
</template>

<script>
    export default {
        name: "app-order-time",
	    props: {
            time: String,
	    },
	    data() {
            return {
                html: '',
	            t: null,
            }
	    },
	    watch: {
            time: {
                handler: function(data) {
                    clearInterval(this.t);
                    let timelog = new Date(data.replace(/-/g, '/'));
                    let time = timelog.getTime() - new Date().getTime();
                    let day = parseInt((time/1000/60/60/24)%30);
                    let hou = parseInt((time/1000/60/60)%24);
                    let min = parseInt((time/1000/60)%60);
                    let sec = parseInt((time/1000)%60);
                    if (day > 0) {
                        this.html = day+"天"+hou+"小时"+(min<10?"0"+min:min) + "分"+(sec<10?"0"+sec:sec) + '秒';
                    } else {
                        this.html = hou+"小时"+(min<10?"0"+min:min) + "分"+(sec<10?"0"+sec:sec) + '秒';
                    }
                    this.t = setInterval(() =>{
                        let time = timelog.getTime() - new Date().getTime();
                        if (time < 0) {
                            clearInterval(this.t);
                        }
                        let day = parseInt((time/1000/60/60/24)%30);
                        let hou = parseInt((time/1000/60/60)%24);
                        let min = parseInt((time/1000/60)%60);
                        let sec = parseInt((time/1000)%60);
                        if (day > 0) {
                            this.html = day+"天"+hou+"小时"+(min<10?"0"+min:min) + "分"+(sec<10?"0"+sec:sec) + '秒';
                        } else {
                            this.html = hou+"小时"+(min<10?"0"+min:min) + "分"+(sec<10?"0"+sec:sec) + '秒';
                        }
                    },1000);
                },
	            immediate: true,
            }
	    },
    }
</script>

<style scoped>

</style>