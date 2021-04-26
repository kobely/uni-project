<template>
    <app-layout>
	    <view class="app-order">
		    <view class="nav">
			    <app-nav :list="tab_list" :theme="getTheme" @click="changeStatus"></app-nav>
		    </view>
	        <view class="order-list">
		        <app-order-list :theme="getTheme" @click="deleteItem" :list="list"></app-order-list>
	        </view>
	    </view>
    </app-layout>
</template>

<script>
	import appNav from '../components/app-nav.vue';
	import appOrderList from '../components/app-order-list.vue';
	import {mapGetters} from "vuex";
	
    export default {
        name: 'order',
	    data() {
            return {
                page: 1,
                pintuan_status: 0,
	            over: false,
	            list: [],
				tab_list: [{
					name: '待收货'
				}, {
					name: '待付款'
				}, {
					name: '待评价'
				}, {
					name: '待评价'
				}, {
					name: '待评价'
				}, {
					name: '待评价'
				}]
            }
	    },
		computed: {
			...mapGetters('mallConfig', {
				getTheme: 'getTheme',
			}),
		},
	    onLoad() { this.$commonLoad.onload();
            this.request(1, 0);
	    },
        onReachBottom() {
            if (!this.over) {
                this.page+=1;
                this.request(this.page, this.pintuan_status);
            }
        },
	    methods: {
            changeStatus(status) {
                this.list = [];
                this.over = false;
                this.page = 1;
                this.pintuan_status = status;
                this.request(1, status);
            },
		    request(page, status) {
                this.$request({
                    url: this.$api.pt.order,
                    data: {
                        page: page,
                        pintuan_status: status,
                    }
                }).then(response => {
                    if (response.code === 0) {
                        if (response.data.list.length === 0) {
                            this.over = true;
                        } else {
                            this.list = [...this.list, ...response.data.list];
                        }
                    }
                });
		    },
            deleteItem(index) {
                this.$delete(this.list, index);
            }
	    },
	    components: {
            'app-nav': appNav,
		    'app-order-list': appOrderList,
	    }
    }
</script>

<style scoped lang="scss">
	.app-order {
		width: #{750rpx};
		background-color: #f7f7f7;
		box-sizing: border-box;
		padding-top: #{80rpx};
	}
	
</style>