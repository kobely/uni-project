<template>
    <app-layout>
	    <app-phone-binding :bind="bind" @click="bindPhone" :phone="phone"></app-phone-binding>
    </app-layout>
</template>

<script>
	import appPhoneBinding from './app-phone-binding/app-phone-binding.vue';
	
    export default {
        name: "binding",
	    data() {
            return {
                bind: false,
                phone: ''
            }
	    },
	    onLoad() { this.$commonLoad.onload();
            this.$request({
	            url: this.$api.user.user_info,
            }).then(response => {
                if (response.code === 0) {
                    if (response.data.mobile !== '') {
                        this.bind = true;
                        this.phone = response.data.mobile;
                    }
                }
            })
	    },
	    methods: {
            bindPhone(data) {
                this.bind = data;
            }
	    },
        components: {
            'app-phone-binding': appPhoneBinding,
        }
    }
</script>
