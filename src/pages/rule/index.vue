<template>
    <app-layout>
        <app-rule
            :content="content"
        ></app-rule>
    </app-layout>

</template>

<script>
    import appRule from "../../components/page-component/app-rule/app-rule.vue";

    export default {
        name: "index",

        components: {
            'app-rule': appRule,
        },

        data() {
            return {
                content: '',
                url: ''
            }
        },

        onLoad(option) { this.$commonLoad.onload(option);
            this.url = decodeURIComponent(option.url);
            this.request();
        },

        methods: {
            // 请求配置
            async request() {
                this.$utils.showLoading();
                try {
                    const res = await this.$request({
                        url: this.url,
                        method: 'get'
                    });
                    this.$utils.hideLoading();
                    if (res.code === 0) {
                        this.content = res.data.content;
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: res.msg
                        });
                    }
                } catch (e) {
                    this.$utils.hideLoading();
                }
            },
        }
    }
</script>
