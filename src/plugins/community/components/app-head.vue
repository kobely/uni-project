<template>
    <image class="head-bg" :style="{'height': height,'background-color': theme.background}" :src="apply ? community.apply : community.bg" ></image>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    export default {
        name: 'app-head',
	    props: {
            apply: Boolean,
            height: {
                type: String,
                default() {
                    return '360rpx';
                }
            },
			theme: Object
        },
	    data() {
            return {
                head: '',
            }
	    },
        computed: {
            ...mapState({
                community: state => state.mallConfig.__wxapp_img.community,
            })
        }
    }
</script>

<style scoped lang="scss">
    .head-bg {
        width: #{750rpx};
        height: #{360rpx};
    }
</style>