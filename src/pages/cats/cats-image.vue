<template>
    <image
            class="cats"
            v-show="is_loading" @load="imgLoad"
            :src="catsImg.cats"  :style="{'background-color': theme.background}"
    ></image>
</template>

<script>
    import { mapGetters, mapState } from 'vuex';
    export default {
        name: "cats-image",

        computed: {
            ...mapState({
                catsImg: state => state.mallConfig.__wxapp_img.cats,
            })
        },
        props: {
            theme: Object
        },

        data() {
            return {
                is_loading: false
            }
        },

        methods: {
            imgLoad() {
                this.is_loading = true;
            }
        }
    }
</script>

<style scoped lang="scss">
    .cats {
        width:#{56rpx};
        height:#{56rpx};
    }
</style>

