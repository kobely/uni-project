<template>
    <app-layout>
	    <view class="search" :style="{backgroundColor: search ? '#f7f7f7': '#ffffff'}">
		    <view class="top dir-left-nowrap cross-center main-between">
			    <input type="text" class="input" :focus="true" v-model="search_text" @blur="request">
			    <image class="delete" v-show="search_text.length>0" @click="empyt_search" src="../image/delete.png"></image>
			    <text style="color:#666666;font-size: 32rpx;" @click="request">搜索</text>
		    </view>
		    <view class="center" v-if="!search">
			    <view class="strong dir-left-nowrap main-between cross-center" v-if="strong.length > 0">
				    <text>历史搜索</text>
				    <image class="delete" src="/static/image/icon/delete.png" @click="empty_strong"></image>
			    </view>
			    <view>
				    <text @click="search_strong(item)" class="strong-item" v-for="(item, index) in strong" :key="index">
					    {{item}}
				    </text>
			    </view>
		    </view>
		    <view class="bottom" v-if="search_list.length>0">
			    <index-product-list :theme="getTheme" :product="search_list"></index-product-list>
		    </view>
		    <view class="order-empty" v-if="search_list.length === 0 && search">
			    <image src="../image/product.png"></image>
			    <text>没有任何信息哦~</text>
		    </view>
	    </view>
    </app-layout>
</template>

<script>
import indexProductList from '../components/index-product-list.vue';
import {mapGetters} from "vuex";

let strong = "ADVANCE_SEARCH";

export default {
   name: 'search',
   data() {
        return {
	        search_text: '',
	        search_list: [],
            strong: [],
	        search: false,
	        page: 1,
            over: false,
            interval: 0,
        }
	  },
	  onLoad() { this.$commonLoad.onload();
		    if (!this.$storage.getStorageSync(strong)) {
		         this.$storage.setStorageSync(strong, []);
		    } else {
		        this.strong = this.$storage.getStorageSync(strong);
		    }
	  },
	computed: {
		...mapGetters('mallConfig', {
			getTheme: 'getTheme',
		})
	},
	onHide() {
        clearInterval(this.interval);
	},
    onUnload() {
        clearInterval(this.interval);
    },
    onReachBottom() {
        if (!this.over) {
            this.page+=1;
            this.$request({
                url: this.$api.advance.goods,
	            method: 'get',
                data: {
                    keyword: this.search_text,
                    page: this.page,
                }
            }).then(res => {
                if (res.code === 0) {
                    if (res.data.list.length > 0) {
                        this.search_list = [...this.search_list, ...res.data.list];
                    } else {
                        this.over = true;
                    }
                }
            })
        }
    },
    methods: {
	    empyt_search() {
		      this.search_text = '';
		      this.search_list = [];
		      this.search = false;
            clearInterval(this.interval);
	    },
	    async request() {
            this.search = true;
            this.page = 1;
            let getStrong = this.$storage.getStorageSync(strong);
            if (this.search_text.match(/^[ ]*$/)) return;
	        let newStrong = [...getStrong, this.search_text];
	        const res = await this.$request({
		        url: this.$api.advance.goods,
                method: 'get',
                data: {
                    keyword: this.search_text,
                    page: this.page,
		        }
	        });
            if (res.code === 0) {
                this.search_list = res.data.list;
                this.set_interval();
                this.$storage.setStorageSync(strong, newStrong);
            }
	    },
        empty_strong() {
	        this.$storage.removeStorageSync(strong);
	        this.strong = [];
	    },
        search_strong(data) {
		        this.search_text = data;
		        this.request();
	      },
        set_interval() {
	          clearInterval(this.interval);
	          this.interval = setInterval(() => {
	              let now = new Date().getTime();
	              if (this.search_list.length === 0) clearInterval(this.interval);
	              for (let i = 0; i < this.search_list.length; i++) {
	                  let timelog = new Date(this.search_list[i].advanceGoods.end_prepayment_at.replace(/-/g, '/')).getTime();
	                  let time = timelog - now;
	                  if (time > 0) {
	                      let day = parseInt((time/1000/60/60/24)%30);
	                      let hou = parseInt((time/1000/60/60)%24);
	                      let min = parseInt((time/1000/60)%60);
	                      let sec = parseInt((time/1000)%60);
	                      if (day > 0) {
	                          this.$set(this.search_list[i], 'html', day+"天"+hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec));
	                      } else {
	                          this.$set(this.search_list[i], 'html', hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec));
	                      }
	                  } else {
	                      this.$delete(this.search_list, i);
	                      if (this.search_list.length < 10 && this.page_count > 1) {
	                          this.$request({
	                              url: this.$api.advance.goods,
	                              method: 'get'
	                          }).then(res => {
	                              if (res.code === 0) {
	                                  this.search_list = res.data.list;
	                                  this.set_interval();
	                              }
	                          });
	                      }
	                  }
	              }
	          }, 1000);
	      }
  },
  components: {
    'index-product-list': indexProductList,
  }
}
</script>

<style lang="scss" scoped>
  .search {
    position: absolute;
    width: #{750rpx};
    height: 100%;
	  background-color: #ffffff;
    .top {
      height: #{104rpx};
      width: 100%;
      background-color: #efeff4;
      padding: #{20rpx 24rpx};
      position: relative;
	    overflow: hidden;
      .delete {
        width: #{32rpx};
        height: #{32rpx};
      }
      .input {
        height: #{64rpx};
        width: #{620rpx};
        border-radius: #{50rpx};
        background-color: #ffffff;
        padding-left: #{32rpx};
        font-size: #{28rpx};
        color: #353535;
      }
      .delete {
        position: absolute;
        right: #{125rpx};
        z-index: 1600;
      }
    }
    .center {
      font-size: #{28rpx};
      padding: #{32rpx 24rpx 0 24rpx};
      .strong {
        color: #666666;
        padding-bottom: #{24rpx};
        text {
          margin-top: #{4rpx};
        }
        .delete {
          width: #{44rpx};
          height: #{32rpx};
          padding: 0 #{6rpx};
        }
      }
	    .strong-item {
		    display: inline-block;
		    height: #{64rpx};
		    line-height: #{64rpx};
		    padding: 0 #{20rpx};
		    margin: #{0 20rpx 16rpx 0};
		    color: #353535;
		    font-size: #{28rpx};
		    border-radius: #{32rpx};
		    background-color: #f7f7f7;
	    }
    }
  }
  .order-empty {
	  position: absolute;
	  top: #{555rpx};
	  left: 50%;
	  transform: translate(-50%, -50%);
	  width: #{240rpx};
	  text-align: center;
	  >image {
		  height: #{240rpx};
		  width: #{240rpx};
	  }
	  >text {
		  font-size: #{24rpx};
		  color: #666666;
	  }
  }
</style>