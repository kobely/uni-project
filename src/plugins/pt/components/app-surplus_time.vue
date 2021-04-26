<template>
	<text>{{html}}</text>
</template>

<script>
    export default {
        name: "app-surplus_time",
	    data() {
            return {
                html: '',
	            time: null,
	            countDown: this.surplus_time
            }
	    },
	    destroyed() {
            clearInterval(this.time);
	    },
	    props: {
            surplus_time: {
                type: Number,
	            default() {
                    return 0;
	            }
            },
            surplus_date_time: String,
	    },
	    methods: {
            setTime(data) {
                let timelog = new Date(data.replace(/-/g, '/'));
                clearInterval(this.time);
                this.time = setInterval(() =>{
                    let time = timelog.getTime() - new Date().getTime();
                    if (time < 0) {
                        clearInterval(this.time);
                    }
                    let day = parseInt((time/1000/60/60/24)%30);
                    let hou = parseInt((time/1000/60/60)%24);
                    let min = parseInt((time/1000/60)%60);
                    let sec = parseInt((time/1000)%60);
                    if (day > 0) {
                        this.html = day+"天"+hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec);
                    } else {
                        this.html = hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec);
                    }
                },1000);
            }
	    },
	    watch: {
            surplus_date_time: {
                handler(time) {
                    if (time) {
						this.setTime(time);
					}
                },
	            immediate: true
            }
	    }
    }
</script>

<style scoped>

</style>