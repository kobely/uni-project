<template>
	<app-layout>
		<view class="app-reservationList">
			<app-prompt-box v-if="hidden" :text="text" @click="confirmNegative"></app-prompt-box>
			<app-write-off-code  :hidden="hiddenCode" :itemId="itemId" @hiden="hiddenCode = false"></app-write-off-code>
			<view class="app-nav">
				<app-head-navigation @click="classification"></app-head-navigation>
			</view>
			<view class="app-reservation">
				<app-reservation-form @click="funHandler" v-for="(item, index) in list" :key="index" :item="item"></app-reservation-form>
			</view>
		</view>
	</app-layout>
</template>

<script>
    import appHeadNavigation from '../components/app-head-navigation.vue';
    import appReservationForm from '../components/app-reservation-form.vue';
	import appPromptBox from '../../../components/basic-component/app-prompt-box/app-prompt-box.vue';
	import appWriteOffCode from '../components/app-write-off-code.vue';
	
    export default {
        name: 'reservationList',
	    components: {
            'app-head-navigation': appHeadNavigation,
		    'app-reservation-form': appReservationForm,
		    'app-prompt-box': appPromptBox,
		    'app-write-off-code': appWriteOffCode,
	    },
	    data() {
            return {
                list: [],
	            page: 1,
                over: false,
	            status: 0,
	            hidden: false,
	            text: '',
                confirm: false,
	            back: '',
	            item: null,
                file_path: '',
                hiddenCode: false,
                itemId: '-1'
            }
	    },
        onLoad(options) { this.$commonLoad.onload(options);
            this.request(this.page, this.status);
        },
	    methods: {
            classification(status) {
                this.list = [];
                this.status = status;
                this.over = false;
                this.page = 1;
                this.request(this.page, status);
            },
		    request(page, status) {
                this.$request({
                    url: this.$api.book.order_list,
                    data: {
                        page: page,
                        status: status,
                    }
                }).then(response => {
                    if (response.code === 0) {
                        if (response.data.list.length === 0) {
                            this.over = true;
                        } else {
                            this.list = [...this.list, ...response.data.list];
                        }
                    }
                }).catch(() => {
                })
		    },
            confirmNegative(data) {
                if (data) {
                    this[this.back]();
                } else {
                    this.hidden = false;
                }
            },
            funHandler(data, item) {
                this.back = data;
                this.item = item;
                if (data === 'refund') {
                    this.text = '是否申请退款';
                    this.hidden = true;
                } else if (data === 'cancel') {
                    this.text = '是否申请取消订单';
                    this.hidden = true;
                } else if (data === 'use') {
                    this[this.back]();
                } else if (data === 'pay') {
                    this.hidden = true;
                    this.text = '申请支付';
                }
            },
            refund() {
                this.$request({
                    url: this.$api.order.cancel,
                    data: {
                        id: this.item.id
                    }
                }).then(response => {
                    if (response.code === 0) {
	                    for (let i = 0; i < this.list.length; i++) {
	                        if (this.list[i].id === this.item.id) {
                                this.$delete(this.list, i);
	                        }
	                    }
                        this.hidden = false;
                    }
                });
            },
            cancel() {
                this.$request({
	                url: this.$api.order.cancel,
	                data: {
	                    id: this.item.id,
	                }
                }).then(response => {
                    if (response.code === 0) {
                        for (let i = 0; i < this.list.length; i++) {
                            if (this.list[i].id === this.item.id) {
	                            this.$delete(this.list, i);
                            }
                        }
                        this.hidden = false;
                    }
                })
            },
            use() {
                this.itemId = this.item.id;
                this.hiddenCode = true;
            },
            pay() {
                this.hidden = false;
                this.$request({
                    url: this.$api.order.list_pay_data,
                    data: {
                        id: this.item.id
                    }
                }).then(response => {
                    if (response.code === 0) {
                        this.$payment.pay(response.data.id).then(() => {
                            for (let i = 0; i < this.list.length; i++) {
                                if (this.list[i].id === this.item.id) {
                                    this.$delete(this.list, i);
                                }
                            }
                        }).catch(() => {
                        });
                    }
                })
            }
	    },
        onReachBottom() {
            if (!this.over) {
                this.page+=1;
                this.request(this.page, this.status);
            }
        }
    }
</script>

<style scoped lang="scss">
	.app-reservationList {
		.app-nav {
			position: fixed;
			top: 0;
			z-index: 1500;
		}
		.app-reservation {
			margin-top:#{80rpx};
			background-color: #f7f7f7;
		}
	}
</style>