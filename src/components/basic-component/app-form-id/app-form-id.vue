<template>
    <view class="app-form-id">
        <form report-submit @submit="formSubmit">
            <button formType="submit" :style="{'color': color ? color : ''}" hover-class="none">
                <slot></slot>
            </button>
        </form>
    </view>
</template>

<script>
    import { push } from '../../../core/formId.js';

    export default {
        name: 'app-form-id',
        props: {
            color: String,
            item: Object,
        },
        methods: {
            formSubmit(e) {
                push(e.detail.formId);
                this.$emit('click', e, this.item);
            }
        }
    }
</script>

<style scoped lang="scss">
    form {
        display: block;
        height: 100%;
        width: 100%;
    }
    button {
        height: 100%;
        width: 100%;
    }
    button {
        display: block;
        line-height: inherit;
        text-align: inherit;
        padding: 0 0;
        background: transparent;
        border: none;
        border-radius: 0;
        overflow: inherit;
        font-size: inherit;
        color: inherit;
    }
    button:after {
        display: none;
    }
    button.button-hover {
        color: inherit;
        background-color: transparent;
    }

    .app-form-id {
        /* #ifndef MP-ALIPAY */
        height: 100%;
        /* #endif */
        /* #ifdef MP-ALIPAY */
        max-height: 100%;
        /* #endif */
    }
</style>