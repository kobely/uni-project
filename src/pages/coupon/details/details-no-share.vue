<template>
    <app-layout>
        <view>
            <app-details :coupon-id="id" :is-show-share="false" :type="type"></app-details>
        </view>
    </app-layout>
</template>

<script>
    import appDetails from './app-details.vue';
    export default {
        name: "details-no-share",
        components: {appDetails},
        data() {
            return {
                type: 2,
                id: 0
            }
        },
        onLoad(option) { this.$commonLoad.onload(option);
            if (option.person) {
                this.type = 2
            } else {
                this.type = 1;
            }
            this.id = option.id;
        },
    }
</script>

<style scoped>

</style>
