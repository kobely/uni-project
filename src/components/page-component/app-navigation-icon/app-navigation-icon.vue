<template>
    <view :style="{backgroundColor: background, height: height}">
        <swiper class="app-swiper" style="height: 100%">
            <swiper-item :style="{height: height}" class="app-swiper-item dir-top-nowrap" v-for="(item, itemIndex) in newData" :key="itemIndex">
                <view v-for="(rows, rowsIndex) in item" class="app-rows dir-left-nowrap" :key="rowsIndex">
                    <block v-for="(columns, columnsIndex) in rows" :key="columnsIndex">
                        <!--#ifdef MP-->
                        <view  class="app-item dir-top-nowrap cross-center" :style="{width: width}">
                            <app-jump-button form :url="columns.link_url" :params="columns.params" :open_type="columns.open_type"  arrangement="column">
                                <image class="app-icon" :src="columns.icon_url" :lazy-load="true"></image>
                                <text :style="{color: color}" class="app-text">{{columns.name}}</text>
                            </app-jump-button>
                        </view>
                        <!--#endif-->
                        <!--#ifdef H5-->
                        <view v-if="columns.open_type !== 'app'" class="app-item dir-top-nowrap cross-center" :style="{width: width}">
                            <app-jump-button  form :url="columns.link_url" :params="columns.params" :open_type="columns.open_type"  arrangement="column">
                                <image class="app-icon" :src="columns.icon_url" :lazy-load="true"></image>
                                <text :style="{color: color}" class="app-text">{{columns.name}}</text>
                            </app-jump-button>
                        </view>
                        <view v-else :id="columns.id" :style="{width: width}">

                        </view>
                        <!--#endif-->
                    </block>
                </view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
    export default {
        name: 'app-navigation-icon',
	    data() {
            return {
                width: uni.upx2px(0)+ 'px',
	            height: 0,
            }
	    },
	    props: {
            background: {
				type: String,
				default() {
				    return '#ffffff';
				}
			},
            color: {
				type: String,
				default() {
				    return '#353535';
				}
			},
            columns: {
				type: Number,
				default() {
				    return 3;
				}
			},
            rows: {
				type: Number,
				default() {
				    return 4;
				}
			},
            scroll: {
				type: Boolean,
				default() {
				    return false;
				}
			},
            navs: {
				type: Array,
				default() {
				    return [
                    ]
				}
			}
	    },
	    computed: {
            newData: function() {
                this.width = `${uni.upx2px(750/this.columns)}px`;
                let menus = [];
                let newMenus = [];
                let num = Number(this.columns)* this.rows;
                // #ifdef H5
                this.navs.forEach(item => {
                   if (item.open_type === 'app') {
                       let width = uni.upx2px(90)+ 'px';
                       let margin = uni.upx2px(8) + 'px';
                       let font = uni.upx2px(24) + 'px';
                       item.id = this.$utils.guid('app-navigation-icon');
                       let username = this.$utils.getUrlParamApp(item.link_url, 'username');
                       let path = this.$utils.getUrlParamApp(item.link_url, 'path');
                       let text = `<div style="width:${this.width};-webkit-align-items: center;align-items: center;display: -webkit-box;display: -webkit-flex;display: flex;-webkit-box-orient: vertical;-webkit-flex-direction: column;flex-direction: column;flex-wrap: nowrap;"><img src="${item.icon_url}" width="${width}" height="${width}" />
<text style="color:${this.color};font-size: ${font};height:${font};line-height: ${font};text-align: center;margin-top: ${margin};word-break: break-all;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp:1;overflow: hidden;">${item.name}</text>
</div>`;
                       this.$utils.createWxOpenLaunchWeapp(item.id, username, path, text);
                   }
                });
                // #endif
                if (this.scroll === true) {
                   for (let i = 0; i < Math.ceil(this.navs.length/num); i++) {
                       menus.push(this.navs.slice(i*num, (i+1)*num));
                   }
                   for (let i = 0; i < menus.length;i++) {
                       let arr = [];
                       for (let j = 0; j < Math.ceil(menus[i].length/ Number(this.columns)); j++) {
                           let men = menus[i].slice(j* Number(this.columns), (j+1)* Number(this.columns));
                           arr.push(men);
                       }
                       newMenus.push(arr);
                   }
                } else {
                    if (this.rows === -1) {
                        menus = [this.navs];
                    } else {
                        menus.push(this.navs.slice(0, num));
                    }
                    for (let i = 0; i < menus.length;i++) {
                        let arr = [];
                        for (let j = 0; j < Math.ceil(menus[i].length/ Number(this.columns)); j++) {
                            let men = menus[i].slice(j* Number(this.columns), (j+1)* Number(this.columns));
                            arr.push(men);
                        }
                        newMenus.push(arr);
                    }
               }
                if (newMenus.length === 0 ) return newMenus;
                return newMenus;
            }
	    },
        watch: {
            newData: {
                handler: function(newVal) {
                    this.height = `${uni.upx2px(newVal[0].length * 156)}px`;
                },
                immediate: true
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-swiper-item {
        width: #{750rpx};
    }
    .app-rows {
        width: #{750rpx};
        margin-top: #{28rpx};
        margin-bottom: #{4rpx};
    }
    .app-icon {
        width: #{90rpx};
        height: #{90rpx};
    }
    .app-text {
        font-size: #{24rpx};
        color: #353535;
        height: #{24rpx};
        line-height: #{24rpx};
        text-align: center;
        margin-top: #{8rpx};
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
    }
    .app-swiper {
        width: 100%;
        height: 100% !important;
    }
</style>