<template>
    <view class="page-width">
	    <form report-submit v-on:submit="getFormId">
		    <view class="page-width switch-tab dir-left-nowrap">
			    <button class="box-grow-1 item" v-on:click="setTab(0)" formType="submit">
				    <text :class="[`${tab_status === 0 ? theme + '-border-bottom' : 'default'}`, `${tab_status === 0 ? theme + '-color' : 'default-color'}`, `text`]">我送出的</text>
			    </button>
			    <button class="box-grow-1 item" v-on:click="setTab(1)" formType="submit">
				    <text :class="[`${tab_status === 1 ? theme + '-border-bottom' : 'default'}`, `${tab_status === 1 ? theme + '-color' : 'default-color'}`, `text`]">我收到的</text>
			    </button>
			    <button class="box-grow-1 item" v-on:click="setTab(2)" formType="submit">
				    <text :class="[`${tab_status === 2 ? theme + '-border-bottom' : 'default'}`, `${tab_status === 2 ? theme + '-color' : 'default-color'}`, `text`]">我参与的</text>
			    </button>
		    </view>
	    </form>
    </view>
</template>

<script>
	
    export default {
        name: 'switch-tab',
        
        props: {
            theme: String,
        },

        data() {
            return {
              tab_status: 0,
            }
        },

        methods: {
          getFormId() {},

          setTab(data) {
              this.$emit('setTab', data);
              this.tab_status = data;
          },
        },

    }
</script>

<style scoped lang="scss">
    @import "../../css/gift.scss";
    .switch-tab {
        .item {
            text-align: center;
            background-color: #f7f7f7;
	        border: none;
	        margin: 0;
	        height: #{104upx};
	        line-height: #{104upx};
	        border-radius: 0;
        }
    }

    // 文字
    .text {
        display: inline-block;
        font-size: #{28upx};
        line-height: #{60upx};
	    border-bottom-width: #{2upx};
	    border-bottom-style: solid;
    }
    
	.default {
		border-bottom-color: transparent;
	}
	
	.default-color {
		color: #666666;
	}
</style>