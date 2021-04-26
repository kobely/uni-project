<template>
    <!-- #ifndef MP-TOUTIAO || MP-ALIPAY || H5 -->
    <view class="bd-item-content" v-if="mall.setting.show_contact_type != 0">
        <view v-if="mall.setting.show_contact_type == 2" class="bd-back dir-top-nowrap main-center cross-center box-grow-0" @click="router('/pages/web/web?url=' + encodeURIComponent(mall.setting.web_service_url))">
            <image class="bd-icon" src="/static/image/icon/detail-tell.png"></image>
            <text class="bd-text">客服</text>
        </view>
        <button v-if="mall.setting.show_contact_type == 1"
                open-type="contact"
                show-message-card
                :send-message-title="name"
                :send-message-path="url"
                class="bd-content bd-back box-grow-0">
            <view class="bd-content-view dir-top-nowrap main-center cross-center ">
                <image class="bd-icon" src="/static/image/icon/detail-tell.png"></image>
                <text class="bd-text">客服</text>
            </view>
        </button>
        <view v-if="mall.setting.show_contact_type == 3" class="bd-item-content dir-top-nowrap main-center cross-center box-grow-0" @click="makePhoneCall()">
            <image class="bd-icon" src="/static/image/icon/detail-tell.png"></image>
            <text class="bd-text">客服</text>
        </view>
    </view>
    <!-- #endif -->
    <!-- #ifdef MP-TOUTIAO || MP-ALIPAY || H5 -->
   <view>
       <view v-if="mall.setting.show_contact_type == 2" class="bd-item-content dir-top-nowrap main-center cross-center box-grow-0" @click="router('/pages/web/web?url=' + encodeURIComponent(mall.setting.web_service_url))">
           <image class="bd-icon" src="/static/image/icon/detail-tell.png"></image>
           <text class="bd-text">客服</text>
       </view>
       <view v-else-if="mall.setting.show_contact_type == 3" class="bd-item-content dir-top-nowrap main-center cross-center box-grow-0" @click="makePhoneCall()">
           <image class="bd-icon" src="/static/image/icon/detail-tell.png"></image>
           <text class="bd-text">客服</text>
       </view>
   </view>
    <!-- #endif -->
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "bd-service",
        props: {
            name: String,
            url: String
        },
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall
            }),
        },
        methods: {
            router(url) {
                uni.navigateTo({
                    url: url
                })
            },
            makePhoneCall() {
                if (this.mall.setting.contact_tel) {
                    uni.makePhoneCall({
                        phoneNumber: this.mall.setting.contact_tel
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .bd-item-content {
        width: 66upx;
        height: 100%;
        margin-right: 20upx;
    }
    .bd-content {
        padding: 0;
        display: block;
        background-color: #ffffff;
        border: none;
    }
    .bd-content-view {
        width:100%;
        height: 100%;
    }
    .bd-back {
        width: 66upx;
        height: 100%;
    }
    .bd-icon {
        width: 30upx;
        height: 30upx;
        margin-bottom: 8upx;
    }
    .bd-text {
        font-size: 20upx;
        color: #888888;
        line-height: 1;
    }
</style>