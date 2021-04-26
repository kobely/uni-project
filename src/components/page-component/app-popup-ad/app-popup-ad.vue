<template>
    <view class="app-popup-ad">
        <block v-for="(item, index) in newList" :key="index">
            <template v-if="item && item.length > 0">
                <view class="modal dir-left-nowrap main-center cross-center"
                      :class="popupActive === index ? 'show' : ''">
                    <view class="body dir-top-nowrap cross-center">
                        <swiper circular autoplay indicator-dots class="app-popup-ad-wh" v-if="item.length > 1">
                            <swiper-item v-for="(modal, key) in item" :key="key" class="main-center">
                                <app-jump-button :url="modal.link.url" :open_type="modal.link.openType"
                                                 @click="closePopupModal">
                                    <image :src="modal.picUrl" mode="aspectFit" class="app-popup-ad-wh"></image>
                                </app-jump-button>
                            </swiper-item>
                        </swiper>
                        <template v-else>
                            <block v-for="(modal, key) in item" :key="key">
                                <app-jump-button :url="modal.link.url" :open_type="modal.link.openType"
                                                 @click="closePopupModal">
                                    <image :src="modal.picUrl" mode="aspectFit" class="app-popup-ad-wh"></image>
                                </app-jump-button>
                            </block>
                        </template>
                        <view class="close" @click="closePopupModal">
                            <image src="/static/image/icon/icon-popup-close.png"></image>
                        </view>
                    </view>
                </view>
            </template>
        </block>
    </view>
</template>

<script>

    export default {
        name: "app-model-ad",
        props: {
            opened: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            times: {
                type: Number,
                default() {
                    return 1;
                }
            },
            list: {
                type: Array,
                default() {
                    return [];
                }
            },
            multiple: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            mark: {
                type: String,
                default() {
                    return 'fxhb';
                }
            },
            is_storage: Boolean,
        },
        data() {
            return {
                newList: [],
                popupActive: -1,
            };
        },
        computed: {
            listenChange() {
                return {
                    multiple: this.multiple,
                    list: this.list,
                    is_storage: this.is_storage,
                    times: this.times,
                };
            }
        },
        watch: {
            listenChange: {
                handler(v) {
                    this.init()
                },
                immediate: true
            }
        },
        methods: {
            init() {
                if (!this.multiple) {
                    this.newList = [this.list];
                } else {
                    this.newList = this.list;
                }
                if (!this.opened) {
                    return;
                }
                if (typeof this.$popupAd.list[this.mark] === 'undefined') {
                    this.$popupAd.list[this.mark] = true;
                    this.$event.on(this.$const.EVENT_POPUP, false).then(mark => {
                        if (mark === this.mark) {
                            this.showPopupModal();
                        }
                    });
                }
                this.showPopupModal();
            },
            showPopupModal() {
                if (this.$popupAd.show) {
                    return;
                }
                let first = 'popUpFirst' + this.mark;
                this.$popupAd.show = this.mark;
                let active = -1;
                if (this.times === 0) {
                    active = 0;
                } else {
                    if (this.$popupAd.first[first]) {
                        active = -1;
                    } else {
                        active = 0;
                    }
                }
                if (!this.is_storage) {
                    this.$popupAd.first[first] = true;
                }
                this.popupActive = active;
                this.nextModal();
            },
            nextModal() {
                if (this.list.length <= this.popupActive || this.popupActive === -1) {
                    let list = this.$popupAd.list;
                    let next = false;
                    for (let i in list) {
                        if (next) {
                            next = false;
                            this.$event.trigger(this.$const.EVENT_POPUP, i);
                            break;
                        }
                        if (i === this.mark) {
                            next = true;
                        }
                    }
                    if (!next) {
                        this.$popupAd.show = null;
                    }
                }
            },
            closePopupModal() {
                let popupActive = this.popupActive;
                popupActive += 1;
                this.popupActive = popupActive;
                this.$popupAd.show = null;
                this.nextModal();
            }
        }
    }
</script>

<style scoped lang="scss">
    .modal {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 1500;
        background-color: rgba(0, 0, 0, 0.4);
        transform: translateY(100%);
        opacity: 0;

        &.show {
            transform: translateY(0%);
            opacity: 1;
        }

        .body {
            .app-popup-ad-wh {
                width: #{650rpx};
                height: #{700rpx};
            }

            .close {
                margin-top: #{30rpx};
                padding: #{20rpx};

                image {
                    width: #{30rpx};
                    height: #{30rpx};
                    display: block;
                }
            }
        }
    }
</style>